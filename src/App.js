import React, { lazy, Suspense } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Layout from "./Layout";
import SideBar from "./components/commons/navigations/SideBar/SideBar";
import Header from "./components/commons/navigations/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthorizeRoute from "./components/commons/authorization/AuthorizeRoute";
import { appRoutes } from "./helperFuncs";
import Progress from "./components/helpers/Progress/PageProgress";
import useInitials from "./components/hooks/useInitials";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FAQ from "./components/screens/FAQ";
import News from "./components/screens/News";
import NewForm from "./components/screens/NewForm";
import Notes from "./components/screens/Notes";
import Verify from "./components/screens/Verify";
import ChangePhoneNumber from "./components/screens/Login/ChangePhoneNumber";
const ForgotPassword = lazy(() => import("./components/screens/Login/ForgotPassword"));
const NewReports = lazy(() => import("./components/screens/NewReports"));
const RegisterReport = lazy(() =>
  import("./components/screens/RegisterReport")
);
const ManageUsers = lazy(() => import("./components/screens/ManageUsers"));
const Login = lazy(() => import("./components/screens/Login"));
// const Verify = lazy(() => import("./components/screens/Verify"));
const NotFound = lazy(() => import("./components/screens/NotFound"));
const Infos = lazy(() => import("./components/screens/Infos"));
const Reports = lazy(() => import("./components/screens/Reports"));
const Polls = lazy(() => import("./components/screens/Polls"));
const Poll = lazy(() => import("./components/screens/Poll"));
const Contractors = lazy(() => import("./components/screens/Contractors"));
const Comments = lazy(() => import("./components/screens/Comments"));
const AddCategory = lazy(() => import("./components/screens/AddCategory"));
const Processes = lazy(() => import("./components/screens/Processes"));
const OrganizationalUnits = lazy(() =>
  import("./components/screens/OrganizationalUnits")
);
const Violations = lazy(() => import("./components/screens/Violations"));
const QuickAccess = lazy(() => import("./components/screens/QuickAccess"));
const Complaints = lazy(() => import("./components/screens/Complaints"));
const AllComplaints = lazy(() => import("./components/screens/AllComplaints"));
const ComplaintsCategories = lazy(() =>
  import("./components/screens/ComplaintsCategories")
);
const ComplaintsUnits = lazy(() =>
  import("./components/screens/ComplaintsUnits")
);
const Form = lazy(() => import("./components/screens/Forms"));
const queryClient = new QueryClient();
const App = () => {
  useInitials();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer newestOnTop={true} rtl={true} className="f15" />
        <div id="content">
          <Suspense fallback={<Progress />}>
            <Switch>
              <Route path="/admin">
                <Header />
                <SideBar />
                <Suspense fallback={<Progress />}>
                  <Layout>
                    <Switch>
                      <AuthorizeRoute
                        path={appRoutes.newReports}
                        component={NewReports}
                      />
                      <AuthorizeRoute
                        path={appRoutes.complaints}
                        component={Complaints}
                      />
                      <AuthorizeRoute
                        path={appRoutes.allComplaints}
                        component={AllComplaints}
                      />
                      <AuthorizeRoute
                        path={appRoutes.infos}
                        component={Infos}
                      />
                      <AuthorizeRoute
                        path={appRoutes.registerReport}
                        component={RegisterReport}
                      />
                      <AuthorizeRoute
                        path={appRoutes.reports}
                        component={Reports}
                      />
                      <AuthorizeRoute
                        path={appRoutes.contractors}
                        component={Contractors}
                      />
                      <AuthorizeRoute
                        path={appRoutes.manageUsers}
                        component={ManageUsers}
                      />
                      <AuthorizeRoute
                        path={appRoutes.polls}
                        component={Polls}
                      />
                      <AuthorizeRoute path={appRoutes.poll} component={Poll} />
                      <AuthorizeRoute
                        path={appRoutes.comments}
                        component={Comments}
                      />
                      <AuthorizeRoute
                        path={appRoutes.categories}
                        component={AddCategory}
                      />
                      <AuthorizeRoute
                        path={appRoutes.processes}
                        component={Processes}
                      />
                      <AuthorizeRoute
                        path={appRoutes.organizationalUnits}
                        component={OrganizationalUnits}
                      />
                      <AuthorizeRoute
                        path={appRoutes.violations}
                        component={Violations}
                      />
                      <AuthorizeRoute
                        path={appRoutes.quickAccess}
                        component={QuickAccess}
                      />
                      <AuthorizeRoute
                        path={appRoutes.notes}
                        component={Notes}
                      />
                      <AuthorizeRoute path={appRoutes.FAQ} component={FAQ} />
                      <AuthorizeRoute path={appRoutes.news} component={News} />
                      <AuthorizeRoute path={appRoutes.forms} component={Form} />
                      <AuthorizeRoute
                        path={appRoutes.complaintsCategories}
                        component={ComplaintsCategories}
                      />
                      <AuthorizeRoute
                        path={appRoutes.complaintsUnits}
                        component={ComplaintsUnits}
                      />
                    </Switch>
                  </Layout>
                </Suspense>
              </Route>

              <Route path={appRoutes.newForm} component={NewForm} />
              <Route path={appRoutes.verify} component={Verify} />
              <Route
                path={appRoutes.changePhoneNumber}
                component={ChangePhoneNumber}
              />
              <Route
                path={appRoutes.forgotPassword}
                component={ForgotPassword}
              />
              <Route path={appRoutes.login} component={Login} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </div>
      </QueryClientProvider>
    </>
  );
};

export default withRouter(App);
