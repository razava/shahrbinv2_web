import React, { useContext, useEffect, useState } from "react";
import styles from "../../../stylesheets/header.module.css";
import DropdownWrapper from "../../helpers/DropdownWrapper";
import {
  appRoutes,
  callAPI,
  checkLoginState,
  clearNull,
  constants,
  getFromLocalStorage,
  isManager,
  logout,
} from "../../../helperFuncs";
import { useHistory } from "react-router-dom";
import { UserInfoAPI } from "../../../apiCalls";
import Avatar from "../dataDisplay/Avatar";
import { AppStore } from "../../../store/AppContext";
import DialogToggler from "../../helpers/DialogToggler";
import ChangePasswordDialog from "../dialogs/ChangePasswordDialog";
import ProfileForm from "../dataDisplay/ProfileForm";
import useMakeRequest from "../../hooks/useMakeRequest";
import shahrbinTitle from "../../../assets/Images/shahrbin_title.png";
import DropDownItem from "../../helpers/DropDown/DropDownItem";
import headerImage from "../../../assets/Images/header.png";

const modalRoot = document && document.getElementById("modal-root");

const Header = () => {
  // history API object
  const history = useHistory();

  // store
  const [state, dispatch] = useContext(AppStore);

  // data states
  const [data, setData] = useState({});

  // flags
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);

  const openDialog = () => {
    modalRoot.classList.add("active");
    setProfileDialog(true);
  };

  const [profileData, loading] = useMakeRequest(
    UserInfoAPI.getUser,
    200,
    profileDialog,
    null
  );

  useEffect(() => {
    const isAuthenticated = checkLoginState();
    if (isAuthenticated) getUser();
  }, []);

  useEffect(() => {
    const isAuthenticated = checkLoginState();
    if (state.apiCall && isAuthenticated) {
      // get user info on profile change
      getUser();
    }
  }, [state.apiCall]);

  // get user info
  const getUser = () => {
    callAPI({
      caller: UserInfoAPI.getUser,
      successStatus: 200,
      successCallback: (res) => {
        setData(res.data);
        localStorage.setItem(
          constants.SHAHRBIN_MANAGEMENT_USERNAME,
          res.data.userName
        );
      },
    });
  };

  const openPasswordDialog = () => {
    modalRoot.classList.add("active");
    setPasswordDialog(true);
  };

  // logout user
  const logUserOut = () => {
    dispatch({ type: "setSideBar", payload: false });
    logout(() => history.push(appRoutes.login));
  };

  const goToHomePage = () => {
    const userRoles = getFromLocalStorage(
      constants.SHAHRBIN_MANAGEMENT_USER_ROLES
    );
    const to = isManager(userRoles) ? appRoutes.infos : appRoutes.newReports;
    history.push(to);
  };
  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__content}>
          <div className={styles.header__right} onClick={goToHomePage}>
            <Brand />
            <span>{state.initials.instance?.name}</span>
          </div>

          {/* <div className="frc h100">
            <img src={headerImage} className="h100 rw3 w100 objfit-cover" />
            <img src={headerImage} className="h100 rw3 w100 objfit-cover" />
            <img src={headerImage} className="h100 rw3 w100 objfit-cover" />
            <img src={headerImage} className="h100 rw3 w100 objfit-cover" />
            <img src={headerImage} className="h100 rw3 w100 objfit-cover" />
          </div> */}

          <div className={styles.header__left}>
            {/* <Mode /> */}

            <HeaderDropDown
              data={data}
              openDialog={openDialog}
              openPasswordDialog={openPasswordDialog}
              logUserOut={logUserOut}
            />
          </div>
        </div>
      </header>

      <DialogToggler
        condition={passwordDialog}
        setCondition={setPasswordDialog}
        width={400}
        isUnique={false}
        fixedDimension={false}
        id="change-password"
      >
        <ChangePasswordDialog setCondition={setPasswordDialog} type={2} />
      </DialogToggler>
      <DialogToggler
        condition={profileDialog}
        setCondition={setProfileDialog}
        width={700}
        isUnique={false}
        loading={loading}
        id="profile-form"
      >
        <ProfileForm data={profileData} setDialog={setProfileDialog} />
      </DialogToggler>
    </>
  );
};

export default Header;

const HeaderDropDown = ({
  data = {},
  openDialog = (f) => f,
  openPasswordDialog = (f) => f,
  logUserOut = (f) => f,
}) => {
  return (
    <DropdownWrapper
      toggleElement={<HeaderDropDownToggle data={data} />}
      position="left bottom"
      theme={{ background: "var(--white)", color: "var(--dark)" }}
      index={0}
      total={4}
      // className={styles.dropdownWrapper}
    >
      <DropDownItem
        title="پروفایل"
        icon="far fa-user"
        hoverIcon="fas fa-user"
        onClick={openDialog}
      />
      <DropDownItem
        title="تغییر رمز عبور"
        icon="far fa-key"
        hoverIcon="fas fa-key"
        onClick={openPasswordDialog}
      />
      <DropDownItem
        title="خروج"
        icon="far fa-sign-out-alt"
        hoverIcon="fas fa-sign-out-alt"
        onClick={logUserOut}
      />
    </DropdownWrapper>
  );
};

const UserInfo = ({ data = {} }) => {
  const showUserInfo = () => {
    return clearNull(data.firstName) + " " + clearNull(data.lastName);
  };

  return (
    <span className="d-flex fdc al-e text-white mx-1">
      <span className="f12 text-primary">{showUserInfo()}</span>
      <span className="f12 text-dark">{data?.title}</span>
    </span>
  );
};

const Brand = ({ onClick = (f) => f }) => {
  return (
    <div className={styles.brand} onClick={onClick}>
      {/* <img src={shahrbinTitle} /> */}
    </div>
  );
};

const HeaderDropDownToggle = ({ data }) => {
  return (
    <>
      <div className={styles.toggleElement}>
        <UserInfo data={data} />
        <Avatar
          // placeholder={!data?.avatar}
          placeholder={true}
          size={2}
          url={data?.avatar?.url}
        />
      </div>
    </>
  );
};
