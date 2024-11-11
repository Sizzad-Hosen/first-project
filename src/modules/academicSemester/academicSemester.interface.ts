// Define the months as string literals
export type TASemesterNameCodeMapper ={
  [key:string]:string,
  
}

export type TMonths = 
  | 'January' 
  | 'February' 
  | 'March' 
  | 'April' 
  | 'May' 
  | 'June' 
  | 'July' 
  | 'August' 
  | 'September' 
  | 'October' 
  | 'November' 
  | 'December';


// Define the semester name types (as string literals)
export type TAcademicSemesterName = 'Autumn' | 'Summer' | 'Fall';

// Define the semester code types (as string literals)
export type TAcademicSemesterCode = '01' | '02' | '03';

// Define the complete academic semester structure
export type TAcademicSemester = {
    name: TAcademicSemesterName;
    code: TAcademicSemesterCode;
    year: string;
    startMonth: TMonths;
    endMonth: TMonths;
};
