import { useState } from "react";



import { fmt } from "../../lib/formatters";







export function DailyActivity({ byDay, onAddTransaction }) {



  const [showAll, setShowAll] = useState(false);



  const entries = Object.entries(byDay).sort((a, b) => new Date(b[0]) - new Date(a[0]));



  const visible = showAll ? entries : entries.slice(0, 10);







  return (



    <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-4 border border-border dark:border-dark-border">



      <div className="text-text-primary dark:text-dark-text-primary font-semibold text-sm mb-3">Daily Activity</div>



      <div className="flex flex-col gap-2 mt-4">



        {Object.keys(byDay).length === 0 && (



          <div className="flex flex-col items-center justify-center py-12 text-center">



            <div className="text-text-secondary dark:text-dark-text-secondary text-sm mb-4">No activity in this period. Add transactions to see daily activity.</div>



            {onAddTransaction && (



              <button 



                className="px-4 py-2 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium border border-transparent transition-colors" 



                onClick={onAddTransaction}



              >



                + Add a transaction



              </button>



            )}



          </div>



        )}



        {visible.map(([date, val]) => (



          <div key={date} className="flex justify-between items-center py-2 border-b border-border dark:border-dark-border">



            <div className="text-xs text-text-secondary dark:text-dark-text-secondary">{date}</div>



            <div className="flex gap-4">



              {val.income > 0 && <span className="font-mono text-xs text-success">+{fmt(val.income)}</span>}



              {val.expense > 0 && <span className="font-mono text-xs text-danger">-{fmt(val.expense)}</span>}



            </div>



          </div>



        ))}



        {entries.length > 10 && (



          <button 



            className="self-center mt-2 px-4 py-2 rounded-md bg-bg-elevated-2 dark:bg-dark-bg-elevated-2 text-text-primary dark:text-dark-text-primary text-sm font-medium border border-border dark:border-dark-border hover:bg-bg-elevated dark:hover:bg-dark-bg-elevated transition-colors" 



            onClick={() => setShowAll(s => !s)}



          >



            {showAll ? "Show Less" : `Show All (${entries.length} days)`}



          </button>



        )}



      </div>



    </div>



  );



}



