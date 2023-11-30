import { Component, OnInit } from '@angular/core';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  PagedData,
  LeasePayment,
  FinancialReport,
} from 'src/app/common/common.types';
import { FinancialReportService } from 'src/app/services/financial-report.service';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.css'],
})
export class FinancialReportComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  pagedList: PagedData<LeasePayment> = {} as PagedData<LeasePayment>;
  financialReport: FinancialReport = {} as FinancialReport;

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private financialReportService: FinancialReportService,
    private toastr: ToastrService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'y', 1);
  }
  ngOnInit(): void {
    this.getReport();
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  // Get the financial report
  getReport() {
    if (this.fromDate && this.toDate) {
      this.financialReportService
        .getFinancialReport(
          this.formatter.format(this.fromDate),
          this.formatter.format(this.toDate)
        )
        .subscribe({
          next: (data) => {
            this.financialReport = data;
          },
          error: (error) => {
            this.toastr.error(error.error.Message);
          },
        });
    }
  }
}
