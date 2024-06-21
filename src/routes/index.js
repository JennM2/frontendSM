import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Admin from "../ui/components/administrator/Admin";
import Student from "../ui/components/student/Student";
import Teachers from "../ui/components/teachers/Teachers";
import Secretaries from "../ui/components/secretaries/Secretaries";
import { Root } from "../ui/components/root/Root";
import Perfil from "../ui/components/administrator/perfil/Perfil";
import Users from "../ui/components/administrator/users/Users";
import Login from "../ui/components/login/Login";
import TeacherList from "../ui/components/administrator/teacher/TeacherList";
import TeacherEvaluation from "../ui/components/administrator/teacher/TeacherEvaluation";
import Students from "../ui/components/administrator/students/Students";
import Backups from "../ui/components/administrator/backups/Backups";
import Subjects from "../ui/components/secretaries/subjects/Subjects";
import Payments from "../ui/components/secretaries/payments/Payments";
import Notifications from "../ui/components/secretaries/notifications/Notifications";
import AssignedSubjects from "../ui/components/teachers/assignedSubjects/AssignedSubjects";
import ActiveSubjects from "../ui/components/teachers/activeSubjects/ActiveSubjects";
import Curriculum from "../ui/components/student/curriculum/Curriculum";
import ScheduleSubject from "../ui/components/student/scheduleSubject/ScheduleSubject";
import Qualification from "../ui/components/student/qualifications/Qualifications";
import PaymentHitory from "../ui/components/student/paymentHistory/PaymentHistory";
import Careers from "../ui/components/administrator/careers/Careers";
import SubjectsCareers from "../ui/components/administrator/subjects/SubjectsCareers"
import Evaluation from "../ui/components/student/evaluation/evaluation";
import Report from "../ui/components/teachers/report/report";

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<Root />}>
      <Route path="/admin" element={<Admin />}>
        <Route path="perfil" element={<Perfil nameUser={"Administrador"} />} />
        <Route path="users" element={<Users />} />
        <Route path="careers" element={<Careers />} />
        <Route path="subjectsCareers" element={<SubjectsCareers />} />
        <Route path="secretaries" element={<Secretaries />} />
        <Route path="list" element={<TeacherList />} />
        <Route path="evaluation" element={<TeacherEvaluation />} />
        <Route path="students" element={<Students />} />
        <Route path="backups" element={<Backups />} />
      </Route>
      <Route path="/secretary" element={<Secretaries />}>
        <Route path="perfil" element={<Perfil nameUser={"Secretary"} />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="payments" element={<Payments />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      <Route path="/teacher" element={<Teachers />}>
        <Route path="perfil" element={<Perfil nameUser={"Teacher"} />} />
        <Route path="assignedSubjects" element={<AssignedSubjects />} />
        <Route path="activeSubjects" element={<ActiveSubjects />} />
        <Route path="report" element={<Report />} />

      </Route>
      <Route path="/student" element={<Student />}>
        <Route path="perfil" element={<Perfil nameUser={"Student"} />} />
        <Route path="qualifications" element={<Qualification />} />
        <Route path="curriculum" element={<Curriculum />} />
        <Route path="scheduleSubject" element={<ScheduleSubject />} />
        <Route path="paymentHistory" element={<PaymentHitory />} />
        <Route path="evaluation" element={<Evaluation />} />

      </Route>
      /
      <Route path="/login" element={<Login />} />
    </Route>
  )
);
