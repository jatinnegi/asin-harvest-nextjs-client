type DataSourceType = "google-sheet" | "local-file";
type ExportType = "csv" | "xlsx" | "google-sheet";
type AmazonDomainType =
  | "amazon.com"
  | "amazon.co.uk"
  | "amazon.de"
  | "amazon.fr"
  | "amazon.it"
  | "amazon.es"
  | "amazon.ca"
  | "amazon.co.jp"
  | "amazon.com.au"
  | "amazon.in"
  | "amazon.com.mx"
  | "amazon.nl";

interface DataSourceOptionType {
  id: number;
  icon: string;
  label: string;
  type: DataSourceType;
}

interface ExportOptionType {
  id: number;
  icon: string;
  label: string;
  type: ExportType;
}

interface AmazonMarketplaceCountryType {
  id: number;
  name: string;
  domain: AmazonDomainType;
  flag: string;
}

interface ProgressProp {
  current: string;
  finished: string[];
  progress: number | null;
  nextProgressStop: number | null;
}
