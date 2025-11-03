
import { Task, TaskPriority, TaskStatus } from '../types';
import { productionCalendar } from './productionCalendar';

function parseTasks(): Task[] {
  const lines = productionCalendar.split('\n');
  const tasks: Task[] = [];
  let currentMonth = '';
  let currentYear = '';
  let idCounter = 0;

  const monthMap: { [key: string]: string } = {
    'OCT': '10', 'NOV': '11', 'DEC': '12',
    'JAN': '01', 'FEB': '02', 'MAR': '03',
    'APR': '04', 'MAY': '05', 'JUN': '06',
    'JUL': '07', 'AUG': '08', 'SEP': '09'
  };

  for (const line of lines) {
    const monthMatch = line.match(/## 📅 MONTH \d+: (.*?)\s(\d{4})/);
    if (monthMatch) {
      const monthStr = monthMatch[1].split(' - ')[0].substring(0, 3).toUpperCase();
      currentMonth = monthMap[monthStr];
      currentYear = monthMatch[2];
      continue;
    }

    const taskMatch = line.match(/-\s\[( |x)\]\s(.*?)$/);
    if (taskMatch && currentMonth && currentYear) {
      const description = taskMatch[2];
      
      let priority: TaskPriority = 'Medium';
      if (description.match(/CRITICAL|MILESTONE|COMPLETE!/i)) {
        priority = 'Critical';
      } else if (description.match(/hero sequence|priority|essential/i)) {
        priority = 'High';
      } else if (description.match(/review|check|plan|prep/i)) {
        priority = 'Low';
      }
      
      const dateMatch = line.match(/(\w{3})\s(\d{1,2})/);
      let dueDate = `${currentYear}-${currentMonth}-01`; // Default to start of month
      if (dateMatch) {
        const day = dateMatch[2].padStart(2, '0');
        const monthStr = dateMatch[1].substring(0,3).toUpperCase();
        const monthNum = monthMap[monthStr] || currentMonth;
        dueDate = `${currentYear}-${monthNum}-${day}`;
      } else {
        const weekMatch = description.match(/Week (\d+)/);
        if (weekMatch) {
            const day = ((parseInt(weekMatch[1])-1) * 7 + 1).toString().padStart(2,'0');
             dueDate = `${currentYear}-${currentMonth}-${day}`;
        }
      }


      tasks.push({
        id: idCounter++,
        description: description,
        dueDate: dueDate,
        status: taskMatch[1] === 'x' ? 'Complete' : 'Incomplete',
        priority: priority,
      });
    }
  }
  return tasks;
}

export const tasks: Task[] = parseTasks();
