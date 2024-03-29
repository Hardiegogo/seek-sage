import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import RequireAuth from '../components/RequireAuth';
import { useRecoilValue } from 'recoil';
import { coursesState } from '../state/atoms/coursesState';
import { ICourse } from '../types';
import ProgressiveLoader from '../components/ProgressiveLoader';
import EditModal from '../components/courses/EditModal';
import { ConfirmationModal, Stars } from '@seek-sage/ui';
import axios from 'axios';
import { useToasts } from '../state/context/ToastContext';

const CoursePage = () => {
  const router = useRouter();
  const courses = useRecoilValue(coursesState);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { addSuccess, addError } = useToasts();

  const deleteHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    try {
      const res = await axios.delete(
        `/api/courses/${selectedCourse?._id as string}`
      );
      if (res.status === 200) {
        addSuccess('Course deleted.');
        router.replace('/');
      }
    } catch (error) {
      addError('error deleting course');
      console.log(error);
    }
  };

  const publishHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    try {
      const res = await axios.put(`/api/courses/${selectedCourse?._id}`, {
        ...selectedCourse,
        published: !selectedCourse?.published,
      } as ICourse);
      if (res.status === 200) {
        if (!selectedCourse?.published) {
          addSuccess('Course published successfully');
        } else addSuccess('Course unpublished');
        router.replace('/');
      }
    } catch (error) {
      addError('error updating course');
      console.log(error);
    }
  };

  useEffect(() => {
    const coursesIds = courses.map((course) => {
      return course._id;
    });
    if (!coursesIds.includes(router.query.courseId as string)) {
      router.replace('/');
    } else {
      setSelectedCourse(
        courses.find(
          (course) => course._id === router.query.courseId
        ) as ICourse
      );
    }
  }, []);
  return (
    <RequireAuth>
      <main className=" grid place-items-center pt-8 bg-bgColor text-textColor">
        {selectedCourse ? (
          <div className="w-[768px] min-w-[50%] flex gap-8">
            <div className="w-[60%] flex-grow">
              <div className="w-full h-60 relative">
                <ProgressiveLoader imgSrc={selectedCourse.imgLink} />
              </div>
              <div className="flex justify-between mt-2 items-center">
                <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
                <p className="text-xl">₹{selectedCourse.price}</p>
              </div>
              <div className="mt-2">
                <div className="flex justify-end">
                  <p className="text-md">
                    <Stars rating={selectedCourse.rating} />
                  </p>
                </div>
                <p className="mt-2 text-base text-lightText">
                  {selectedCourse.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-6 flex-grow-0">
              {selectedCourse.published ? (
                <button
                  className="border-[1px] px-3 py-2 rounded-xl hover:bg-bgDark w-40"
                  onClick={publishHandler}
                >
                  Unpublish course
                </button>
              ) : (
                <button
                  className="border-[1px] px-3 py-2 rounded-xl hover:bg-bgDark w-40"
                  onClick={publishHandler}
                >
                  Publish course
                </button>
              )}
              <button
                className="border-[1px] px-3 py-2 rounded-xl hover:bg-bgDark w-40"
                onClick={() => setIsEdit(true)}
              >
                Edit course
              </button>
              <button
                className="border-none px-3 py-2 bg-red-500 text-bgColor rounded-xl hover:bg-red-400 w-40"
                onClick={() => setIsDeleteModal(true)}
              >
                Delete course
              </button>
            </div>
          </div>
        ) : (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-3 bg-primary"
              viewBox="0 0 24 24"
            ></svg>
          </>
        )}
        {isEdit && (
          <EditModal course={selectedCourse as ICourse} setIsEdit={setIsEdit} />
        )}
        <ConfirmationModal
          isModal={isDeleteModal}
          setIsModal={setIsDeleteModal}
          clickHandler={(e) => deleteHandler(e)}
          message="Delete this course?"
          isDanger={true}
        />
      </main>
    </RequireAuth>
  );
};

export default CoursePage;
