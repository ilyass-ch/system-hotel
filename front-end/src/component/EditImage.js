// import React, { useState, useContext } from 'react';
// import { Upload, Button, message, Avatar } from 'antd';
// import { UploadOutlined, UserOutlined } from '@ant-design/icons';
// import UserContext from './UserContext';
// import Cookies from 'js-cookie';
// import axios from 'axios';

// const EditImage = () => {
//   const { user, setUser } = useContext(UserContext);
//   const [loading, setLoading] = useState(false);
//   const [imageUrl, setImageUrl] = useState(user.profilePicture || '');

//   // Handle image upload
//   const handleImageUpload = async ({ file }) => {
//     setLoading(true);
//     try {
//     //   const formData = new FormData();
//       formData.append('imageUrl', file);

//       const token = Cookies.get('token');

//        // Update user profile data
//        const response = await axios.put(
//         `http://localhost:7000/api/updateprofile/${userId}`,
//         {
//           imageUrl: `http://localhost:7000/images/${imageUrl}`,
//           ...values, // Add other form values (e.g., name, email)
//         },
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer ${token}`,
//           },
//           withCredentials: true, // Send cookies with the request
//         }
//       );

//       // Update context with new image URL
//       setUser(prevState => ({
//         ...prevState,
//         profilePicture: response.data.imageUrl,
//       }));
//       setImageUrl(file.name);
//       message.success('Profile picture updated successfully!');
//     } catch (error) {
//       message.error('Failed to upload profile picture. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Edit Profile Image</h2>
//       <Upload
//         customRequest={handleImageUpload}
//         showUploadList={false}
//         accept="image/*"
//       >
//         <Avatar
//           src={imageUrl}
//           icon={<UserOutlined />}
//           size={64}
//           style={{ backgroundColor: '#87d068' }}
//         />
//         <Button icon={<UploadOutlined />} style={{ marginLeft: 10 }} loading={loading}>
//           Upload
//         </Button>
//       </Upload>
//     </div>
//   );
// };

// export default EditImage;
