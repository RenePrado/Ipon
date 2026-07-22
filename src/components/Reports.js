import { useState, useMemo } from "react";



import { thisMonth } from "../lib/formatters";



import { PeriodComparisonDonut } from "./reports/PeriodComparisonDonut";



import { CategoryBreakdown } from "./reports/CategoryBreakdown";



import { ReportStats } from "./reports/ReportStats";



import { DailyActivity } from "./reports/DailyActivity";
import { MonthPicker } from "./common/MonthPicker";
import { DatePicker } from "./common/DatePicker";







export function Reports({ transactions, categories }) {



  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'custom'



  const [month, setMonth] = useState(thisMonth());



  const [fromDate, setFromDate] = useState('');



  const [toDate, setToDate] = useState('');







  // Filter transactions based on view mode



  const { filteredTx, monthTx, income, expense, byDay } = useMemo(() => {



    const filteredTx = viewMode === 'monthly'



      ? transactions.filter(t => t.date?.startsWith(month))



      : transactions.filter(t => {



          if (!fromDate || !toDate) return false;



          return t.date >= fromDate && t.date <= toDate;



        });







    const monthTx = filteredTx;



    const income = monthTx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);



    const expense = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);







    const byDay = {};



    monthTx.forEach(t => {



      if (!byDay[t.date]) byDay[t.date] = { income: 0, expense: 0 };



      if (t.type === "income") byDay[t.date].income += Number(t.amount);



      if (t.type === "expense") byDay[t.date].expense += Number(t.amount);



    });







    return { filteredTx, monthTx, income, expense, byDay };



  }, [transactions, viewMode, month, fromDate, toDate]);







  return (



    <div>



      <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 mb-4 sm:mb-6 items-start sm:items-center">
        {viewMode === 'monthly' ? (
          <div className="grid grid-cols-3 sm:flex sm:flex-row gap-1.5 sm:gap-2 w-full sm:w-auto items-center">
            <button
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium h-8 sm:h-9 flex items-center justify-center transition-colors duration-300 ${
                viewMode === 'monthly'
                  ? 'bg-accent-primary hover:bg-accent-primary/90 text-white border border-transparent'
                  : 'bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2'
              }`}
              onClick={() => setViewMode('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium h-8 sm:h-9 flex items-center justify-center transition-colors duration-300 ${
                viewMode === 'custom'
                  ? 'bg-accent-primary hover:bg-accent-primary/90 text-white border border-transparent'
                  : 'bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2'
              }`}
              onClick={() => setViewMode('custom')}
            >
              Custom Range
            </button>
            <MonthPicker
              value={month}
              onChange={setMonth}
              className="w-full sm:w-40"
            />
          </div>
        ) : (
          <>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <button
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium h-8 sm:h-9 flex items-center justify-center transition-colors duration-300 ${
                  viewMode === 'monthly'
                    ? 'bg-accent-primary hover:bg-accent-primary/90 text-white border border-transparent'
                    : 'bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2'
                }`}
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium h-8 sm:h-9 flex items-center justify-center transition-colors duration-300 ${
                  viewMode === 'custom'
                    ? 'bg-accent-primary hover:bg-accent-primary/90 text-white border border-transparent'
                    : 'bg-bg-elevated dark:bg-dark-bg-elevated text-text-primary dark:text-dark-text-primary border border-border dark:border-dark-border hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2'
                }`}
                onClick={() => setViewMode('custom')}
              >
                Custom Range
              </button>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <DatePicker
                value={fromDate}
                onChange={setFromDate}
                className="w-full sm:w-40"
              />
              <span className="text-text-tertiary dark:text-dark-text-tertiary text-xs sm:text-sm h-8 sm:h-9 flex items-center">to</span>
              <DatePicker
                value={toDate}
                onChange={setToDate}
                className="w-full sm:w-40"
              />
            </div>
          </>
        )}
        <span className="text-text-tertiary dark:text-dark-text-tertiary text-xs sm:text-sm h-8 sm:h-9 flex items-center">
          {viewMode === 'monthly'
            ? `Showing report for ${month}`
            : (fromDate && toDate
              ? `Showing report from ${fromDate} to ${toDate}`
              : 'Select date range')}
        </span>
      </div>







      <ReportStats income={income} expense={expense} transactionCount={monthTx.length} />







      {/* Period Comparison Donut Charts */}



      <div className="overflow-x-auto mb-4 sm:mb-6">
        <PeriodComparisonDonut transactions={filteredTx} categories={categories} />
      </div>







      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">



        <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border">



          <div className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium uppercase tracking-wider mb-4">Expense Breakdown</div>



          <div className="mt-4">



            <CategoryBreakdown transactions={monthTx} categories={categories} />



          </div>



        </div>







        <DailyActivity byDay={byDay} />



      </div>



    </div>



  );



}



