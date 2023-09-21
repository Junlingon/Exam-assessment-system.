import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';


import Login from "@/pages/login";
import AdminManage from '@/pages/admin_manage';
import CorretExam from '@/pages/corret_exam';
import CorretExamList from './pages/corret_exam_list';
import Exam from './pages/exam';
import ExamHistory from './pages/exam_history';
import ExamSelect from './pages/exam_select';
import PersonInfo from './pages/person_info';
import ReadExam from './pages/read_exam';
// import StudentManage from './pages/student_manage';
// import SubjectAdd from './pages/subject_add';
import SubjectManage from './pages/subject_manage/index';

import './App.scss';
import Layout from './common_components/layout';
import { routersData } from "./config";


import { get_user_info } from './store/slice/user';
import EventBus from '@/util/event'
import { useAppDispatch } from './store';
import { notification } from 'antd';
import { logoutRequest } from './util/request';
import useRenderCheck from './hooks/renderCheck';


// const AsyncKanbanPage = lazy(() => import(/* webpackChunkName: "kanban_page" */'./pages/kanban'))
const AsyncSubjectAdd = lazy(() => import(/* webpackChunkName: "subject_add" */'./pages/subject_add'))
const AsyncStudentManage = lazy(() => import(/* webpackChunkName: "student_manage" */'./pages/student_manage'))


function SubjectAdd () {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <AsyncSubjectAdd />
      </Suspense>
  )
}
function StudentManage () {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <AsyncStudentManage />
      </Suspense>
  )
}


const openNotification = (msg: string) => {
  notification.error({
    message: '发生错误',
    description: `错误信息： ${msg}`
  });
};

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useRenderCheck('App')

  useEffect(() => {
    // 通用的配置  或者 用户信息等待接口   建议放在根组件
    dispatch(get_user_info())

    EventBus.on("global_not_login", function (msg) {
      navigate('/login')
    })

    // 业务错误
    EventBus.on("global_error_tips", function (msg) {
      openNotification(msg)
    })

    // 没有权限的处理
    EventBus.on("global_error_auth", function (msg) {
      openNotification(msg)

      logoutRequest().then(() => {
        navigate('/login')
      }).then(() => {

        
        navigate('/login')
      }) 
    })
  }, [])



  return (
    <Routes>
      <Route path="/" element={<Navigate to={'/login'}></Navigate>}></Route>
      {/* 页面1  登录 */}
      <Route path={routersData.login.path} element={<Login />}></Route>

      <Route element={<Layout />}>
        {/*页面12： 管理员管理 （超级管理员） */}
        <Route path={routersData.admin_manage.path} element={<AdminManage />}></Route>
        {/* 页面8： 批改试卷（管理员） */}
        <Route path={routersData.corret_exam.path} element={<CorretExam />}></Route>
        {/* 页面7： 批阅试卷列表（管理员） */}
        <Route path={routersData.corret_exam_list.path} element={<CorretExamList />}></Route>
        {/* 页面4： 考试 (学生) */}
        <Route path={routersData.exam.path} element={<Exam />}></Route>
        {/* 页面5： 学生考试记录 （学生） */}
        <Route path={routersData.exam_history.path} element={<ExamHistory />}></Route>
        {/* 页面3： 考题选择 （学生） */}
        <Route path={routersData.exam_select.path} element={<ExamSelect />}></Route>
        {/* 页面2： 个人信息录入（学生 管理员） */}
        <Route path={routersData.person_info.path} element={<PersonInfo />}></Route>
        {/* 页面6 查看试卷（学生 管理员） */}
        <Route path={routersData.read_exam.path} element={<ReadExam />}></Route>
        {/* 页面9： 学生管理(管理员) */}
        <Route path={routersData.student_manage.path} element={<StudentManage />}></Route>
        {/* 页面11： 考题录入（管理员） */}
        <Route path={routersData.subject_add.path} element={<SubjectAdd />}></Route>
        {/* 页面10： 课程管理 （管理员） */}
        <Route path={routersData.subject_manage.path} element={<SubjectManage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
