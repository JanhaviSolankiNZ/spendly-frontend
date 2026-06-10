import {useForm,useWatch, type Resolver} from "react-hook-form";
import { expenseSchema, type ExpenseData } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react";
import { expenseService } from "@/services/expenseService";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EXPENSE_CATEGORIES } from "@/types";
import axios from "axios";

const AddExpensePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { register, handleSubmit, control, setValue, reset, formState: {errors, isSubmitting} } = useForm<ExpenseData>({
    resolver: zodResolver(expenseSchema) as Resolver<ExpenseData>,
    defaultValues: {date: new Date().toISOString().split("T")[0], amount:0}
  });

  const description = useWatch({control, name: "description"});

  useEffect(() => {
     if (!description || description.length < 3) return;
     const timer = setTimeout(async () => {
      try{
        const res = await expenseService.aiClassifyCategory({description});
        const category = res.data?.category;
        if(category){
          setValue("category", category, {
            shouldDirty: true,
            shouldValidate: true
          })
        }

      }catch(err){
        console.log("AI category failed", err);
      }
     }, 600)
     return() => {
      clearTimeout(timer);
     }

  },[description, setValue])

  useEffect(() => {
    if(!isEdit) return;

    expenseService.getById(id!)
      .then(({data}) => {
        const e = data.data.expense;
        reset({
          description: e.description,
          amount: e.amount,
          date: e.date.split("T")[0],
          category: e.category,
          notes: e.notes ?? ""
        })
      })
      .catch(() => toast.error("Failed to load expense"))

  }, [id, isEdit, reset]);

  const onSubmit = async (values: ExpenseData) => {
    try{
      if(isEdit){
        await expenseService.update(id!,values);
        toast.success("Expense updated");
      }else{
        await expenseService.create(values);
        toast.success("Expense saved");
      }
      navigate("/expenses");
    }catch(error){
      if(axios.isAxiosError(error)){
        toast.error(error.response?.data?.message || "Failed to save expense")
      }else{
        toast.error("Failed to save expense")
      }

    }
  }

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-muted-foreground">{isEdit ? "Edit Expense": "Add Expense"}</h1>
            <p className="text-xs sm:text-sm text-secondary mt-0.5">
              {isEdit ? "Update the expense details below": "Fill in the details below"}
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-secondary cursor-pointer gap-1.5" onClick={() => navigate("/expenses")}>
            <ArrowLeft size={14} />
            <span className="hidden sm:hidden">Back</span>
          </Button>
        </div>
        <div className="max-w-lg">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-secondary text-xs font-medium tracking-widest uppercase">Expense details</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                  <div className="space-y-1.5">
                      <Label className="text-foreground text-sm">Description</Label>
                      <Input
                      placeholder="e.g. Grocery run, Netflix, Rent..."
                      className="h-11 text-base sm:text-sm"
                      {...register("description")}
                       />
                       {errors.description && (
                        <p>{errors.description.message}</p>
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
                      {errors.amount && (<p className="text-xs text-red-400">{errors.amount.message}</p>)}
                    </div>
                    <div className="space-y-1.5">
                       <Label className="text-foreground text-sm">Date</Label>
                       <Input
                        type="date"
                        className="h-11 text-base sm:text-sm"
                        {...register("date")}
                       />
                       {errors.date && (<p className="text-xs text-red-400">{errors.date.message}</p>)}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">
                      Category
                    </Label>
                    <select {...register("category")} className="w-full h-11 bg-background border border-border text-muted-foreground px-3 rounded-lg text-sm outline-none focus:border-primary cursor-pointer">
                       {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">Notes
                      <span className="text-secondary font-normal text-xs ml-2">(optional)</span>
                    </Label>
                    <Input
                    placeholder="Any extra context..."
                    className="h-11 text-base sm:text-sm"
                    {...register("notes")}
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 text-sm font-medium cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Saving...</>: isEdit ? ("Update Expense") : ("Save expense")}
                  </Button>
                </form>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}

export default AddExpensePage
