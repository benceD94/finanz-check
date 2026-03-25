export interface ScenarioInput {
  loanAmount: number;
  interestRate: number;   // % per year
  tilgungRate: number;    // % per year
  extraPayment: number;   // € per year
}

export interface DataPoint {
  year: number;
  remainingBalance: number;
  totalInterestPaid: number;
  yearlyInterest: number;   // Zinsen paid this year
  yearlyTilgung: number;    // principal repaid this year
}

export interface Scenario {
  id: string;
  label: string;
  input: ScenarioInput;
  data: DataPoint[];
  totalInterest: number;
  payoffYears: number;
}
