export class FilterModel {
  pageNumber = 1;
  pageSize = 5;
  sortColumn = '';
  sortOrder = 'asc';
  searchText = '';
}

export class ResponseModel {
  data: any = [];
  statusCode!: number;
  message = '';
  appError = '';
  meta!: Metadata;
}
export class Metadata {
  totalRecords!: number;
  currentPage!: number;
  pageSize!: number;
  defaultPageSize!: number;
  totalPages!: number;
}
export class PatientReportModal {
  fps!: number;
  pauses!: number;
  stops!: number;
  trackingQuality!: number;
  duration: string="0";
  CreatedDate!:string;
  change!:number;
}
