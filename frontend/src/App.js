import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavbarComponent from './user/components/navbar';
import HomePage from './user/pages/home';
import UserAuthentication from './user/components/user-authentication';
import { createContext, useEffect, useState } from 'react';
import { lookInSession } from './common/session';
import ProfilePage from './user/pages/profile';
import CreatePostPage from './user/pages/create-post';
import AdminHome from './admin/pages/home-page';
import AdminSidebar from './admin/components/sidebar';
import AdminDashboard from './admin/pages/dashboard';
import AdminPost from './admin/components/posts';
import AdminPostDetails from './admin/pages/post-details';
import Sidebar from './user/components/sidebar';
import Elements from './user/pages/elements';
import PostDetails from './user/pages/post-details';
import Feature from './user/pages/feature';
import AllUserShown from './admin/pages/user.page';
import LoadingBar from 'react-top-loading-bar';
import AddCategory from './admin/components/add-category';
import BlogComingSoon from './user/pages/blog-page';
import Store from './user/pages/store';
import MyFavourite from './user/pages/my-favourite';

export const UserContext = createContext({});
export const AdminContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState({});
  const [adminAuth, setAdminAuth] = useState({});
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let userInSession = lookInSession("user");
    let adminInSession = lookInSession("admin");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    adminInSession ? setAdminAuth(JSON.parse(adminInSession)) : setAdminAuth({ access_token: null });
  }, [])
  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <AdminContext.Provider value={{ adminAuth, setAdminAuth }}>
        <LoadingBar
          color="#7781b7"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="z-50"
        />
        <Routes>

          <Route path='/' element={<NavbarComponent />}>
            <Route path='' element={<HomePage setProgress={setProgress} />} />
            <Route path='/profile/:id' element={<ProfilePage setProgress={setProgress} />} />
            <Route path='/create' element={<CreatePostPage setProgress={setProgress} />} />
            <Route path={'/:category'} element={<Elements setProgress={setProgress} />} />
            <Route path='/tags/:tag' element={<Elements setProgress={setProgress} />} />
            <Route path='/:username/:postId' element={<PostDetails setProgress={setProgress} />} />
            <Route path='/limelight' element={<Feature setProgress={setProgress} />} />
            <Route path='/blog' element={<BlogComingSoon />} />
            <Route path='/my favourites' element={<MyFavourite setProgress={setProgress}/>}/>
            <Route path='/store' element={<Store setProgress={setProgress} />} />
          </Route>
          <Route path='/admin-auth' element={<AdminHome setProgress={setProgress} />} />
          <Route path='/admin/' element={<AdminSidebar setProgress={setProgress} />}>
            <Route path='add-category' element={<AddCategory setProgress={setProgress} />} />
            <Route path='dashboard' element={<AdminDashboard setProgress={setProgress} />} />
            <Route path='posts' element={<AdminPost setProgress={setProgress} />} />
            <Route path='users' element={<AllUserShown setProgress={setProgress} />} />
            <Route path='posts/:username/:postId' element={<AdminPostDetails setProgress={setProgress} />} />
          </Route>
        </Routes>
      </AdminContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
