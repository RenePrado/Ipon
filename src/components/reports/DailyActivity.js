import { useState } from "react";



import { fmt } from "../../lib/formatters";







export function DailyActivity({ byDay }) {



  const [showAll, setShowAll] = useState(false);



  const entries = Object.entries(byDay).sort((a, b) => new Date(b[0]) - new Date(a[0]));



  const visible = showAll ? entries : entries.slice(0, 10);







  return (



    <div className="bg-bg-elevated dark:bg-dark-bg-elevated rounded-lg p-5 border border-border dark:border-dark-border">



      <div className="text-text-secondary dark:text-dark-text-secondary text-sm font-medium uppercase tracking-wider mb-4">Daily Activity</div>



      <div className="flex flex-col gap-0">



        {Object.keys(byDay).length === 0 && (



          <div className="flex items-center justify-center py-12 text-center">



            <div className="text-text-secondary dark:text-dark-text-secondary text-sm">No activity in this period</div>



          </div>



        )}



        {visible.map(([date, val]) => (



          <div key={date} className="flex justify-between items-center py-2.5 border-b border-border dark:border-dark-border last:border-b-0">



            <div className="text-xs text-text-secondary dark:text-dark-text-secondary">{date}</div>



            <div className="flex gap-4">



              {val.income > 0 && <span className="text-xs font-medium tabular-nums text-success">+{fmt(val.income)}</span>}



              {val.expense > 0 && <span className="text-xs font-medium tabular-nums text-danger">-{fmt(val.expense)}</span>}



            </div>



          </div>



        ))}



        {entries.length > 10 && (



          <button 



            className="self-center mt-4 px-3 py-2 rounded-md border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary text-sm font-medium hover:bg-bg-elevated-2 dark:hover:bg-dark-bg-elevated-2 transition-colors" 



            onClick={() => setShowAll(s => !s)}



          >



            {showAll ? "Show Less" : `Show All (${entries.length} days)`}



          </button>



        )}



      </div>



    </div>



  );



}



