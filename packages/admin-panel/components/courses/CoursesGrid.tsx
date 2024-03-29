import { coursesState } from '../../state/atoms/coursesState';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import CourseCard from './CourseCard';
import { useRouter } from 'next/router';
import axios, { AxiosError } from 'axios';
import { filteredCoursesState } from '../../state/selectors/filteredCoursesState';
import { signIn } from 'next-auth/react';

const CoursesGrid: React.FC = () => {
  const setCourses= useSetRecoilState(coursesState);
  const filteredCourses = useRecoilValue(filteredCoursesState);
  const router = useRouter();
  console.log(filteredCourses);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error?.response?.status === 401) {
            return signIn()
          }
        }
      }
    })();
  }, []);

  return (
    <main className="p-8 px-12 text-textColor flex flex-wrap gap-16 h-fit w-fit">
      {filteredCourses?.length
        ? filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        : 'No courses available'}
    </main>
  );
};

export default CoursesGrid;
