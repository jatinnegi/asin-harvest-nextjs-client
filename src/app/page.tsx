"use client";
import { useRef, useState } from "react";
import { Container } from "@/components/container";
import { HeadingRich } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImportSheetRulesDialog } from "@/components/import-sheet-rules-dialog";
import { LiveProgress } from "@/components/live-progress";
import { ExportSuccess } from "@/components/export-success";
import { Loader2 as LoaderIcon, X as XIcon } from "lucide-react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import clsx from "clsx";

import axios from "axios";

import {
  amazonMarketplacesCountries,
  dataSourceOptions,
  exportOptions,
} from "@/lib/data";

interface FormSchema {
  dataSource: DataSourceType;
  googleSheetLink: string;
  file: null | File;
  amazonDomain: AmazonDomainType | null;
  exportOption: ExportType | null;
}

const initialFormData: FormSchema = {
  dataSource: "google-sheet",
  googleSheetLink: "",
  file: null,
  amazonDomain: null,
  exportOption: null,
};

interface ErrorProps {
  msg: string;
  renderNumber: number;
}

const initialErrorState: ErrorProps = {
  msg: "",
  renderNumber: 1,
};

export default function () {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const googleSheetLinkInputRef = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState<
    "idle" | "connecting" | "importing" | "done"
  >("idle");
  const [progress, setProgress] = useState<ProgressProp>({
    current: "",
    finished: [],
    progress: null,
    nextProgressStop: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [liveProgressOpen, setLiveProgressOpen] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [dataSourceInputError, setDataSourceInputError] =
    useState<ErrorProps>(initialErrorState);
  const [amazonMarketplaceError, setAmazonMarketplaceError] =
    useState<ErrorProps>(initialErrorState);
  const [exportOptionError, setExportOptionError] =
    useState<ErrorProps>(initialErrorState);

  const [exportedLink, setExportedLink] = useState<string>("");
  const [exportSuccessOpen, setExportSuccessOpen] = useState<boolean>(false);

  const [form, setForm] = useState<FormSchema>(initialFormData);

  const [openImportSheetRulesDialog, setOpenImportSheetRulesDialog] =
    useState<boolean>(false);

  const startExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let hasDataSourceInputError = false;
    let hasAmazonMarketplaceError = false;
    let hasExportFormatError = false;

    if (form.dataSource === "google-sheet") {
      const googleSheetLink = form.googleSheetLink;
      if (
        !/^https?:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+/.test(
          googleSheetLink,
        )
      ) {
        setDataSourceInputError({
          msg: "*Enter a valid google sheet link.",
          renderNumber: dataSourceInputError.renderNumber + 1,
        });
        hasDataSourceInputError = true;
      }
    } else {
      const file = form.file;
      if (!file) {
        setDataSourceInputError({
          msg: "*Please upload a file.",
          renderNumber: dataSourceInputError.renderNumber + 1,
        });
        hasDataSourceInputError = true;
      }
    }

    if (form.amazonDomain === null) {
      setAmazonMarketplaceError({
        msg: "*Please choose the Amazon marketplace.",
        renderNumber: amazonMarketplaceError.renderNumber + 1,
      });
      hasAmazonMarketplaceError = true;
    }

    if (form.exportOption === null) {
      setExportOptionError({
        msg: "*Please select your preferred export option.",
        renderNumber: exportOptionError.renderNumber + 1,
      });
      hasExportFormatError = true;
    }

    if (
      hasDataSourceInputError ||
      hasAmazonMarketplaceError ||
      hasExportFormatError
    ) {
      if (hasDataSourceInputError || hasAmazonMarketplaceError) {
        mainRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    try {
      const formData = new FormData();
      if (form.dataSource === "google-sheet") {
        formData.append("data_source_type", "google_sheet_link");
        formData.append("google_sheet_link", form.googleSheetLink);
      } else {
        formData.append("data_source_type", "local_file");
        formData.append("file", form.file || "");
      }

      setLoading(true);
      const asinCodesRetrieveURL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/retrieve-asin-codes/`;
      const { data } = await axios.post(asinCodesRetrieveURL, formData);

      if (data?.reduced) {
        toast.message(
          "Due to hardware limitations only the first 10 ASINs will be retrieved.",
        );
      }

      setLiveProgressOpen(true);

      const socket = new WebSocket(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL_WS}/ws`,
      );
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            asin_codes: data?.asin_codes,
            export_type: form.exportOption,
            amazon_marketplace: form.amazonDomain,
          }),
        );
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "error") {
            toast.error(data.message);
          } else {
            setStatus("importing");
            const current = data?.current || "";
            const finished = data?.finished || [];
            const progress = data?.progress || 0;
            const nextProgressStop = data?.next_progress_stop || 0;
            const exportedLink = data?.exported_link || "";
            if (exportedLink) {
              setExportedLink(exportedLink);
              setLiveProgressOpen(false);
              setExportSuccessOpen(true);
            }
            setProgress({ current, finished, progress, nextProgressStop });
          }
        } catch (err) {
          console.error(err);
        }
      };

      socket.onerror = () => {
        toast.error("Connection error. Please try again later.");
        setStatus("idle");
      };

      socket.onclose = () => {
        setStatus("idle");
      };
    } catch (err) {
      const error: any = err;
      const detail = error?.response?.data?.detail;

      toast.error(detail);
      setForm({ ...form, googleSheetLink: "" });

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" duration={5000} />{" "}
      <Container>
        <section className="w-full max-w-2xl flex flex-col">
          <p className="flex items-center gap-2 text-base sm:text-lg text-muted-foreground">
            <span className="mb-0.5">⬡</span>{" "}
            <span className="tracking-widest">ASIN DATA RETRIEVAL</span>
          </p>
          <h1 className="text-3xl sm:text-5xl font-fraunces font-semibold leading-10 sm:leading-16 mt-1 sm:mt-2 mb-4 sm:mb-6">
            Extract Amazon
            <br /> product data across all{" "}
            <span className="italic text-chart-2">marketplaces.</span>
          </h1>
          <p className="text-sm sm:text-xl leading-6 sm:leading-8">
            Upload your ASIN list from a spreadsheet or local file, pick your
            marketplace, and get a fully formatted export in seconds.
          </p>
        </section>
        <div ref={mainRef} className="w-full flex flex-col gap-4">
          <section className="w-full border-2 border-solid border-foreground/10 bg-card rounded-sm pt-6 flex flex-col gap-4 sm:gap-8">
            <article className="flex flex-col gap-6 w-full px-4 sm:px-6">
              <HeadingRich
                serialNumber={1}
                text="Data Source"
                helpCb={() => {
                  setOpenImportSheetRulesDialog(true);
                }}
              />
              <ul className="grid grid-cols-2 border border-solid border-foreground/10">
                {dataSourceOptions.map(
                  (dataSourceOption: DataSourceOptionType) => (
                    <li key={dataSourceOption.id}>
                      <Button
                        type="button"
                        className={clsx(
                          `${form.dataSource === dataSourceOption.type ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-background/50 text-foreground hover:bg-foreground/10 hover:text-foreground"}`,
                          "w-full flex gap-2 items-center justify-center py-6 rounded-none",
                        )}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDataSourceInputError(initialErrorState);
                          setForm({
                            ...form,
                            dataSource: dataSourceOption.type,
                          });
                        }}
                      >
                        <span>{dataSourceOption.icon}</span>
                        <span>{dataSourceOption.label}</span>
                      </Button>
                    </li>
                  ),
                )}
              </ul>
              {form.dataSource === "google-sheet" ? (
                <Field orientation="vertical" className="gap-2">
                  <Label
                    htmlFor="google-spreadsheet-url"
                    className="text-xs sm:text-sm text-foreground/60"
                  >
                    GOOGLE SPREADSHEET URL
                  </Label>
                  <div className="w-full flex flex-col gap-1.5">
                    <Input
                      key={dataSourceInputError.renderNumber}
                      ref={googleSheetLinkInputRef}
                      id="google-spreadsheet-url"
                      type="text"
                      className={clsx(
                        dataSourceInputError.msg
                          ? "animate-shake-x border-destructive focus:border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                          : "",
                        "text-sm sm:text-base py-5 sm:py-6",
                      )}
                      placeholder="Enter a Google sheet link"
                      autoComplete="off"
                      value={form.googleSheetLink}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault();
                        setForm({ ...form, googleSheetLink: e.target.value });
                        setDataSourceInputError(initialErrorState);
                      }}
                    />
                    {dataSourceInputError.msg ? (
                      <small className="text-destructive">
                        {dataSourceInputError.msg}
                      </small>
                    ) : (
                      <></>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm mt-1 text-foreground/60">
                    ASINs must be in <span>Column A.</span> Make sure sharing is
                    set to "Anyone with the link."
                  </p>
                </Field>
              ) : (
                <div className="flex flex-col w-full gap-1.5">
                  <Button
                    key={dataSourceInputError.renderNumber}
                    type="button"
                    className={clsx(
                      dragging
                        ? "bg-foreground/5 hover:bg-foreground/5"
                        : "bg-foreground/0 hover:bg-foreground/5",
                      dataSourceInputError.msg
                        ? "animate-shake-x border-destructive hover:bg-destructive/5"
                        : "border-foreground/15 hover:bg-foreground/5",
                      "w-full h-36 sm:h-64 border border-solid text-foreground flex flex-col items-center justify-center gap-0",
                    )}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    onDragOver={(e: React.DragEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragging(true);
                    }}
                    onDrop={(e: React.DragEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const droppedFile = e.dataTransfer.files[0];
                      if (droppedFile) {
                        const ext = droppedFile.name.split(".").pop() || "";
                        if (["csv", "xlsx"].includes(ext)) {
                          setForm({ ...form, file: droppedFile });
                          setDataSourceInputError(initialErrorState);
                        } else {
                          toast.error("Please upload an XLSX or CSV file.");
                        }
                      }
                      setDragging(false);
                    }}
                    onDragLeave={(e: React.DragEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDragging(false);
                    }}
                  >
                    <span className="text-2xl sm:text-3xl">⬆️</span>
                    <span className="text-base sm:text-lg font-light mt-2 sm:mt-3 mb-1.5 sm:mb-2">
                      <span className="font-medium">Click to browse</span> or
                      drag & drop
                    </span>
                    <ul className="flex gap-2 text-xs sm:text-sm font-light text-foreground/75">
                      <li>XLSX</li>
                      <li>•</li>
                      <li>CSV - ASINs in Column A</li>
                    </ul>
                  </Button>
                  {dataSourceInputError.msg ? (
                    <small className="text-destructive">
                      {dataSourceInputError.msg}
                    </small>
                  ) : (
                    <></>
                  )}
                  <input
                    ref={fileInputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const uploadedFile = e.target.files?.[0];
                      if (uploadedFile) {
                        setForm({ ...form, file: uploadedFile });
                        setDataSourceInputError(initialErrorState);
                      }
                    }}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                  />
                  {form.file ? (
                    <div className="w-full border border-solid border-foreground/15 rounded-sm mt-2 flex items-center gap-4 py-4 px-6">
                      <span className="text-xl sm:text-2xl">📄</span>
                      <p className="text-sm sm:text-base flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        {form.file.name}
                      </p>
                      <Button
                        type="button"
                        className="bg-transparent hover:bg-transparent text-foreground h-auto w-auto"
                        style={{ padding: "0px" }}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setForm({ ...form, file: null });
                          fileInputRef.current!.value = "";
                        }}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </article>
            <hr />
            <article className="flex flex-col gap-6 w-full px-4 sm:px-6">
              <HeadingRich
                serialNumber={2}
                text="Amazon Marketplace"
                helpCb={() => {}}
                tooltipText="Avoid 404 errors by choosing the correct Amazon marketplace."
              />
              <ul
                key={amazonMarketplaceError.renderNumber}
                className={clsx(
                  amazonMarketplaceError.msg ? "animate-shake-x" : "",
                  "grid grid-cols-2 sm:grid-cols-3 gap-3",
                )}
              >
                {amazonMarketplacesCountries.map(
                  (amazonMarketplaceCountry: AmazonMarketplaceCountryType) => (
                    <li key={amazonMarketplaceCountry.id}>
                      <Button
                        type="button"
                        className={clsx(
                          amazonMarketplaceError.msg
                            ? "bg-background/10 hover:bg-destructive/5 border-destructive"
                            : form.amazonDomain ===
                                amazonMarketplaceCountry.domain
                              ? "bg-chart-2/10 hover:bg-chart-2/10 border-chart-2/25"
                              : "bg-background/10 hover:bg-chart-2/10 border-foreground/10 hover:border-chart-2/25",
                          "flex flex-col gap-1 h-auto w-full py-4 border border-solid rounded-xs",
                        )}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setAmazonMarketplaceError(initialErrorState);
                          setForm({
                            ...form,
                            amazonDomain: amazonMarketplaceCountry.domain,
                          });
                        }}
                      >
                        <span className="text-2xl mb-1">
                          {amazonMarketplaceCountry.flag}
                        </span>
                        <span className="text-foreground tracking-wider font-normal">
                          {amazonMarketplaceCountry.name}
                        </span>
                        <span className="text-foreground/50 text-xs">
                          {amazonMarketplaceCountry.domain}
                        </span>
                      </Button>
                    </li>
                  ),
                )}
              </ul>
            </article>
            <hr />
            <article className="flex flex-col gap-6 w-full px-4 sm:px-6">
              <HeadingRich
                serialNumber={3}
                text="Export Format"
                helpCb={() => {}}
                tooltipText="How would you like your data?"
              />
              <ul
                key={exportOptionError.renderNumber}
                className={clsx(
                  exportOptionError.msg ? "animate-shake-x" : "",
                  "flex flex-wrap gap-2 error-animation",
                )}
              >
                {exportOptions.map((exportOption: ExportOptionType) => (
                  <li key={exportOption.id}>
                    <Button
                      type="button"
                      className={clsx(
                        exportOptionError.msg
                          ? "bg-background/10 hover:bg-destructive/5 border-destructive"
                          : form.exportOption === exportOption.type
                            ? "bg-chart-2/10 hover:bg-chart-2/10 border-chart-2/25"
                            : "bg-background/10 hover:bg-chart-2/10 border-foreground/10 hover:border-chart-2/25",
                        "flex gap-2 sm:gap-3 h-auto w-full border border-solid rounded-full py-0.5 sm:py-3 px-3 sm:px-6",
                      )}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setExportOptionError(initialErrorState);
                        setForm({ ...form, exportOption: exportOption.type });
                      }}
                    >
                      <span className="text-lg sm:text-2xl">
                        {exportOption.icon}
                      </span>
                      <span className="text-foreground tracking-wider font-normal text-xs sm:text-sm">
                        {exportOption.label}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </article>
            <article className="flex flex-col gap-4 sm:gap-6 w-full bg-background/75 px-6 sm:px-12 py-6 sm:py-8">
              <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-foreground max-w-lg">
                The system will read ASINs from Column A, retrieve live product
                data from Amazon, and deliver your export.
              </p>
              <Button
                type="button"
                className="py-6"
                onClick={startExport}
                disabled={loading}
              >
                {loading ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="13 17 18 12 13 7"></polyline>
                      <polyline points="6 17 11 12 6 7"></polyline>
                    </svg>
                    <span className="text-sm sm:text-base font-fraunces">
                      Run Harvest
                    </span>
                  </>
                )}
              </Button>
            </article>
          </section>
          <div className="w-full bg-card flex gap-2 sm:gap-4 p-3 sm:p-6 border-l-4 border-solid border-chart-2">
            <span className="text-xl">💡</span>
            <p className="max-w-xl text-foreground text-xs sm:text-sm leading-6 sm:leading-7">
              <strong>What data is retrieved?</strong> Title, brand, category,
              price, rating, review count, BSR (Best Seller Rank), availability
              status, number of images, A+ content presence, and seller type
              (FBA/FBM/AMZ).
            </p>
          </div>
        </div>
        <ImportSheetRulesDialog
          openImportSheetRulesDialog={openImportSheetRulesDialog}
          setOpenImportSheetRulesDialog={setOpenImportSheetRulesDialog}
        />
        <LiveProgress open={liveProgressOpen} progress={progress} />
        <ExportSuccess
          exportedLink={exportedLink}
          open={exportSuccessOpen}
          close={() => {
            setExportSuccessOpen(false);
            setProgress({
              current: "",
              finished: [],
              progress: null,
              nextProgressStop: 0,
            });
            setForm(initialFormData);
            window.scrollTo(0, 0);
          }}
        />
      </Container>
    </>
  );
}
