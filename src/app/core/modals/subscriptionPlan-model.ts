export interface SubscriptionPlan {
    subscriptionPlanID: string;
    planName: string;
    planType: string;
    noOfPlans: string;
    noOfSessions: string;
    monthlyFee: string;
    yearlyFee: string;
  }

  export interface SubscriptionPlanList{
    subscriptionPlanID: string;
    planName: string;
    planType: string;
    noOfSessions: string;
    monthlyFee: string;
    yearlyFee: string;
    paymentID: number;
    remainingSessions: number;
    expiredOnDate: string;
    createdOn: string;
  }