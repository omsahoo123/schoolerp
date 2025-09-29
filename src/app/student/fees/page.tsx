'use client';

import { CheckCircle, Clock, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { feeData } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function FeesPage() {
  const { toast } = useToast();
  const percentagePaid = (feeData.paidFees / feeData.totalFees) * 100;

  const handlePayNow = () => {
    toast({
      title: 'Redirecting to Payment Gateway',
      description: 'This is a simulation. No real payment will be processed.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">Fee Payment</CardTitle>
              <CardDescription>Review your fee details and complete payments.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-secondary/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:justify-around text-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-2xl font-bold">${feeData.totalFees.toLocaleString()}</p>
                </div>
                <div className="hidden md:block">
                  <Separator orientation="vertical" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fees Paid</p>
                  <p className="text-2xl font-bold text-green-600">${feeData.paidFees.toLocaleString()}</p>
                </div>
                <div className="hidden md:block">
                  <Separator orientation="vertical" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold text-destructive">${(feeData.totalFees - feeData.paidFees).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={percentagePaid} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">{percentagePaid.toFixed(0)}% of total fees paid.</p>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-2">Installment Details</h3>
            <div className="space-y-4">
              {feeData.installments.map((installment) => (
                <div key={installment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {installment.status === 'Paid' ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Clock className="h-6 w-6 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-semibold">Installment {installment.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {installment.status === 'Paid'
                          ? `Paid on ${installment.paymentDate}`
                          : `Due on ${installment.dueDate}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${installment.amount.toLocaleString()}</p>
                    <p className={`text-sm font-semibold ${installment.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {installment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handlePayNow} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Pay Balance Now: ${(feeData.totalFees - feeData.paidFees).toLocaleString()}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
