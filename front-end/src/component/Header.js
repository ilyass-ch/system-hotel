import React, { useContext, useState, useEffect } from 'react';
import { Menu, Avatar } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserContext from './UserContext';
import {
  HomeOutlined,
  CreditCardOutlined,
  LoginOutlined,
  DingdingOutlined,
  UserAddOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  StarOutlined,
  BankOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  RobotOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [current, setCurrent] = useState('home');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (user && user._id) {
      axios.get(`http://localhost:7000/api/user/profile/${user._id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      })
        .then((response) => {
          setImageUrl(response.data.imageUrl || ''); // Adjust according to your API response
        })
        .catch((error) => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  }, [user]);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const handleLogout = () => {
    // Supprimer le cookie du token en définissant une date d'expiration passée
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Supprimer les autres éléments du localStorage si nécessaire
    localStorage.removeItem('user');
    setUser(null);
    
    // Redirection après déconnexion
    window.location.href = '/';
  };
  

  const menuStyle = {
    overflow: 'hidden',
    padding: '20px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#e2e8ea"
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}>
        <h1 style={{ fontWeight: 'bold' }}>
          <Link to='/'>
            <span style={{ color: '#18458b' }}>
              <DingdingOutlined />
              Royale
            </span>
            Hotel
          </Link>
        </h1>
      </div>

      <Menu
        onClick={handleClick}
        selectedKeys={[current]}
        mode='horizontal'
        style={menuStyle}>
        {user ? (
          <SubMenu
            key='user-menu'
            icon={
              <Avatar
                style={{
                  backgroundColor: '#87d068',
                  marginRight: 10,
                }}
                src={imageUrl}
                icon={<UserOutlined />}
              />
            }
            title={user.name}
            style={{ marginLeft: 'auto' }}
          >
            <Menu.ItemGroup>
              <Menu.Item key='edit-profile' icon={<ProfileOutlined />}>
                <Link to='/EditProfile'>Edit profile</Link>
              </Menu.Item>

              {/* Afficher Manage Users uniquement pour les administrateurs */}
              {user.role === 'admin' && (
                <Menu.Item key='manage-users' icon={<TeamOutlined />}>
                  <Link to='/manageUsers'>Manage Users</Link>
                </Menu.Item>
              )}

              {/* Afficher le menu Manage uniquement pour les administrateurs */}
              {user.role === 'admin' && (
                <SubMenu key='manage' title="Manage" icon={<SettingOutlined />}>
                  <Menu.Item key='manage-city' icon={<EnvironmentOutlined />}>
                    <Link to='/manageCity'>Manage City</Link>
                  </Menu.Item>
                  <Menu.Item key='manage-hotel' icon={<BankOutlined />}>
                    <Link to='/manageHotel'>Manage Hotel</Link>
                  </Menu.Item>
                  <Menu.Item key='manage-room' icon={<ApartmentOutlined />}>
                    <Link to='/manageRoom'>Manage Room</Link>
                  </Menu.Item>
                </SubMenu>
              )}

              <Menu.Item key='booking' icon={<UnorderedListOutlined />}>
                <Link to='/Booking'>Booking</Link>
              </Menu.Item>

              <Menu.Item key='reviews' icon={<StarOutlined />}>
                Reviews
              </Menu.Item>

              <Menu.Item key='logout' icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
        ) : (
          <>
            <Menu.Item key='login' icon={<LoginOutlined />}>
              <Link to='/login'>Login</Link>
            </Menu.Item>

            <Menu.Item key='register' icon={<UserAddOutlined />}>
              <Link to='/register'>Register</Link>
            </Menu.Item>
          </>
        )}

        <Menu.Item key='home' icon={<HomeOutlined />}>
          <Link to='/'>Home</Link>
        </Menu.Item>
        {user && (
        <Menu.Item key='reservations' icon={<CreditCardOutlined />}>
          <Link to='/ReservationsForm'>Reservations</Link>
        </Menu.Item>
        )}

        {/* Afficher "Rapports de Statistiques" uniquement pour les administrateurs */}
        {user && user.role === 'admin' && (
          <Menu.Item key='statistics' icon={<AppstoreAddOutlined />}>
            <Link to='/StatisticsReports'>Rapports de Statistiques</Link>
          </Menu.Item>
        )}

        {/* <Menu.Item key='chat' icon={<RobotOutlined />}>
          <Link to='/ChatList'>ChatBot</Link>
        </Menu.Item> */}
      </Menu>
    </>
  );
};

export default Header;
