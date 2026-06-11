import { useCallback, useEffect, useState } from "react";
import { incomeSchema, type IncomeData } from "@/utils/schema";
import IncomeItem from "../components/IncomeItem";
import { INCOME_TYPES, type Income } from "@/types";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeService } from "@/services/incomeService";
import toast from "react-hot-toast";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2 } from "lucide-react";

const currentMonth = () => new Date().toISOString().slice(0, 7);

const IncomesPage = () => {
    const [incomes,     setIncomes]     = useState<Income[]>([]);
    const [summary,     setSummary]     = useState<any>(null);
    const [month,       setMonth]       = useState(currentMonth());
    const [loadingList, setLoadingList] = useState(false);

    const { register, handleSubmit, reset, formState: {errors, isSubmitting} } = useForm<IncomeData>({
        resolver: zodResolver(incomeSchema) as Resolver<IncomeData>,
        defaultValues:{
          source: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          incomeType: "Salary",
          notes: ""
        }
    })
const fetchHistory = useCallback(async () => {
        setLoadingList(true);
        try{
            const [listRes, sumRes] = await Promise.all([
                incomeService.getAll({month}),
                incomeService.summary(month)
            ]);

            setIncomes(listRes.data.data.incomes);
      setSummary(sumRes.data.data);
        }catch{
            toast.error("Failed to load income history");
        }finally{
            setLoadingList(false);
        }
    },[month])


    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
    }, [fetchHistory]);

    const onSubmit = async (values: IncomeData) => {
        try {
      await incomeService.create(values);
      toast.success("Income saved!");
      reset({
        source: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        incomeType: "Salary",
        notes: ""
      });
      fetchHistory()
    } catch (error) {
      if(axios.isAxiosError(error)){
        toast.error(error.response?.data?.message || "Failed to save income")
      }else{
        toast.error("Failed to save expense")
      }
      }
    }

    const handleDelete = async (id: string) => {
      if(!confirm("Delete this income entry?")) return;
      try{
        await incomeService.delete(id);
        toast.success("Income entry deleted");
        fetchHistory();
      }catch{
        toast.error("Failed to delete");
      }
    }

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-muted-foreground">Add income</h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">Record a new income entry</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-secondary text-xs font-medium tracking-widest uppercase">Income details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                <Label className="text-foreground text-sm">
                  Source / description
                </Label>
                <Input
                  placeholder="e.g. Monthly salary, Freelance project..."
                  className="h-11 text-base sm:text-sm"
                  {...register("source")}
                />
                {errors.source && (
                  <p className="text-xs text-red-400">{errors.source.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-sm">Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    inputMode="decimal"
                    className="h-11 text-base sm:text-sm"
                    {...register("amount")}
                  />
                  {errors.amount && (
                    <p className="text-xs text-red-400">{errors.amount.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground text-sm">Date received</Label>
                  <Input
                    type="date"
                    className="h-11 text-base sm:text-sm"
                    {...register("date")}
                  />
                  {errors.date && (
                    <p className="text-xs text-red-400">{errors.date.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground text-sm">Income type</Label>
                <select
                  {...register("incomeType")}
                  className="w-full h-11 bg-background border border-border text-muted-foreground px-3 rounded-lg text-sm outline-none focus:border-primary cursor-pointer"
                >
                  {INCOME_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground text-sm">
                  Notes
                  <span className="text-secondary font-normal text-xs ml-2">
                    (optional)
                  </span>
                </Label>
                <Input
                  placeholder="Any extra context..."
                  className="h-11 text-base sm:text-sm"
                  {...register("notes")}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-sm font-medium cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  : "Save income entry"
                }
              </Button>
              </form>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4">
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        Income history
                      </p>
                      <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="bg-background border border-border text-primary text-xs px-2 py-1.5 rounded-lg outline-none focus:border-primary cursor-pointer"
                      />
                    </div>

                    {summary && (
                <div className="bg-background rounded-xl p-4 border border-border">
                  <p className="text-xs text-secondary mb-1">
                    Total income this month
                  </p>
                  <p className="text-2xl font-semibold text-primary">
                    ${summary.total.toLocaleString()}
                  </p>
                   {/* breakdown by type */}
                    {summary.byType.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-3">
                        {summary.byType.map((t: any) => (
                          <div key={t.type}>
                            <p className="text-[10px] text-secondary">{t.type}</p>
                            <p className="text-sm font-medium text-muted-foreground">
                              ${t.total.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-border flex-1">
            <CardContent className="pt-4">
              {loadingList ? (
                <div className="flex justify-center py-10">
                  <Loader2 size={20} className="animate-spin text-primary" />
                </div>
              ) : incomes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-secondary">
                  <Briefcase size={28} className="mb-2 opacity-30" />
                  <p className="text-sm">No income entries this month</p>
                </div>
              ) : (
                <div>
                  {incomes.map((inc) => (
                    <IncomeItem
                      key={inc._id}
                      income={inc}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
    </div>
  )
}

export default IncomesPage
