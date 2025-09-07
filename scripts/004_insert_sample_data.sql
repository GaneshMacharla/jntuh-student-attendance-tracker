-- Insert sample departments
INSERT INTO public.departments (name, code) VALUES
  ('Computer Science and Engineering', 'CSE'),
  ('Electronics and Communication Engineering', 'ECE'),
  ('Mechanical Engineering', 'MECH'),
  ('Civil Engineering', 'CIVIL')
ON CONFLICT (code) DO NOTHING;

-- Insert sample courses for CSE department
INSERT INTO public.courses (name, code, department_id, semester, year, credits)
SELECT 
  course_name,
  course_code,
  d.id,
  course_semester,
  course_year,
  course_credits
FROM (VALUES
  ('Data Structures', 'CS205ES', 2, 1, 3),
  ('Database Management Systems', 'CS305ES', 3, 2, 4),
  ('Operating Systems', 'CS402ES', 4, 2, 4),
  ('Computer Networks', 'CS405ES', 4, 2, 4),
  ('Machine Learning', 'CS601ES', 6, 3, 4),
  ('Artificial Intelligence', 'CS603ES', 6, 3, 4)
) AS courses(course_name, course_code, course_semester, course_year, course_credits)
CROSS JOIN public.departments d
WHERE d.code = 'CSE'
ON CONFLICT (code) DO NOTHING;
