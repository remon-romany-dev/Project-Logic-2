import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  DollarSign,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface Transaction {
  id: string;
  type: "deposit" | "usage" | "refund";
  amount: number;
  description: string;
  createdAt: Date;
}

// Mock data
const mockBalance = 24.50;
const mockTransactions: Transaction[] = [
  { id: "1", type: "deposit", amount: 50.00, description: "Added funds via Stripe", createdAt: new Date("2024-01-15") },
  { id: "2", type: "usage", amount: -0.04, description: "DALL-E 3 image generation", createdAt: new Date("2024-01-15") },
  { id: "3", type: "usage", amount: -0.02, description: "GPT-4o chat message", createdAt: new Date("2024-01-14") },
  { id: "4", type: "usage", amount: -0.15, description: "Bulk code analysis", createdAt: new Date("2024-01-14") },
  { id: "5", type: "refund", amount: 5.00, description: "Service credit", createdAt: new Date("2024-01-10") },
];

const predefinedAmounts = [10, 25, 50, 100];

export default function Wallet() {
  const { t } = useLanguage();
  const [balance] = useState(mockBalance);
  const [transactions] = useState(mockTransactions);
  const [addAmount, setAddAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddFunds = async () => {
    if (!addAmount || isLoading) return;

    setIsLoading(true);
    // Simulate Stripe checkout (will be replaced with real API)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setDialogOpen(false);
    setAddAmount("");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "usage":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "refund":
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const totalSpent = transactions
    .filter((t) => t.type === "usage")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalDeposited = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t("nav.wallet")}</h1>
          <p className="text-muted-foreground">Manage your pay-as-you-go balance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="col-span-1 sm:col-span-2">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-500">
                  <WalletIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("wallet.balance")}</p>
                  <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
                </div>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="button-add-funds">
                    <Plus className="h-4 w-4" />
                    {t("wallet.addFunds")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {t("wallet.addFunds")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Predefined amounts */}
                    <div className="flex flex-wrap gap-2">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={addAmount === amount.toString() ? "default" : "outline"}
                          onClick={() => setAddAmount(amount.toString())}
                          data-testid={`amount-${amount}`}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>

                    {/* Custom amount */}
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="pl-9"
                        min="1"
                        data-testid="input-custom-amount"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Payments are processed securely via Stripe. Funds never expire.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button
                      onClick={handleAddFunds}
                      disabled={!addAmount || Number(addAmount) <= 0 || isLoading}
                      className="gap-2"
                      data-testid="button-confirm-payment"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pay ${addAmount || "0"}
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col justify-center p-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-destructive">${totalSpent.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Info */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { model: "GPT-4o", cost: "$0.002", unit: "per message", free: false },
                { model: "DALL-E 3", cost: "$0.04", unit: "per image", free: false },
                { model: "Gemini", cost: "Free", unit: "1,500/day", free: true },
                { model: "Claude", cost: "Free", unit: "1,000/day", free: true },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                  data-testid={`pricing-${item.model.toLowerCase().replace(" ", "-")}`}
                >
                  <div>
                    <p className="font-medium">{item.model}</p>
                    <p className="text-sm text-muted-foreground">{item.unit}</p>
                  </div>
                  <Badge variant={item.free ? "secondary" : "outline"}>
                    {item.cost}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("wallet.history")}
            </CardTitle>
            <Badge variant="secondary">{transactions.length} transactions</Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {t(`wallet.${transaction.type}`)}
                          </Badge>
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        transaction.amount > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
