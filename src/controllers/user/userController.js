
const CustomError = require("../../errors/CustomError");
const User = require("../../models/User");
const bcrypt = require('bcrypt');
const { checkUserRole } = require("../../utils/user/checkUserRole");
const resetPassword = require("../../utils/user/resetPassword");
const {findUserAndCheckImage} = require('../../utils/findUserAndCheckImage');

const {uploadImageToCloudinary} = require("../../utils/imageUploadCloudinary");
const paginate = require("../../utils/paginate");

const getAllEntities = async (req, res, next) => {
    try {
      let { limit, page } = req.pagination;
      const { search } = req.query;
  
      let query = {
        role: ['admin', 'user'],
      };
      
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' }},  
          { email: { $regex: search, $options: 'i' } },  
          { role: { $regex: search, $options: 'i' } },  
        ];
      }

      const entity = await paginate(User, query, page, limit, {}, '', '-password');
      if(entity.data.length === 0){
         return next(new CustomError('No users found',404));
      }
      res.status(200).json({ users: entity });

    } catch (err) {
      next(new CustomError(err.message, 500));
    }
  };
  

        const getSingleEntity = async(req,res,next)=>{
                    const {entityId} = req.params;
                    try {
                        const entity = await User.findById(entityId);
                        if (!entity) {
                        
                            return next(new CustomError('User not found', 404));
                        }
                        res.status(200).json({user:entity})
                    } catch (err) {
                        next(new CustomError(err.message,500));
                    }
        }

        const updateSingleEntity= async(req,res,next)=>{
                    const {entityId} = req.params;
                    const updatedData  = req.body;
                
                    try {
                            if (updatedData.password) {
                                    const hashedPassword = await bcrypt.hash(updatedData.password, 10);
                                    updatedData.password = hashedPassword;
                            }

                            const entity = await User.findByIdAndUpdate(entityId,updatedData,{ new : true })
                                                     .select("-password");
                            if(!entity){
                                return next(new CustomError('User not found',404));
                            }
                            res.status(200).json({message:'User updated sucessfully',user:entity});
                    } catch (err) {
                        next(new CustomError(err.message,500));
                    }
          }

        const superAdminBlockUnblock = async(req,res,next)=>{
                
                        const {entityId} = req.params;
                        const {block} = req.body;

                        try {
                                const entity = await User.findById(entityId);
                                if(!entity){
                                    return next(new CustomError('User not found',404));
                                }
                                if(entity.isBlocked && block){
                                        return next(new CustomError('User is already blocked',400));
                                }
                                if(!entity.isBlocked && !block){
                                        return next(new CustomError('User is already unblocked',400));
                                }
                                entity.isBlocked = block;
                                await entity.save();

                                res.status(200).json({message:`User  ${block ? 'blocked' : 'unblocked'} successfully`});
                        
                                
                        } catch (err) {
                                next(new CustomError(err.message,500));
                        }
           }

        const superAdminDelete = async (req, res, next) => {
                const { entityId } = req.params;
                try {
                    const entity = await User.findById(entityId);
                    if (!entity) {
                        return res.status(404).json({ error: 'Use not found' });
                    }
            
                    await User.deleteOne({ _id: entityId }); 
                    res.status(200).json({ message: 'User deleted successfully', deletedUser: entity });

                } catch (err) {
                    next(new CustomError(err.message, 500));
                }
          };

        const getSuperAdminProfile = async(req,res,next)=>{

                try {
                        const superAdminId = req.user.id;  
                        const superAdmin = await User.findById(superAdminId);
                        if(!superAdmin){
                            return next(new CustomError('Super-admin not found',404));
                        }
                        res.status(200).json({profile:superAdmin});
                } catch (err) {
                        next(new CustomError(err.message,500));  
                }

           }  

        const updateSuperAdminProfile = async (req, res, next) => {
            try {
                const superAdminId = req.user.id; 
                const updatedData= req.body;
                const superAdmin = await User.findByIdAndUpdate(superAdminId,updatedData,{ new : true })
                                                .select("-password");
                
                res.status(200).json({ message: 'Profile data updated successfully', updatedProfile: superAdmin });
            } catch (err) {
                next(new CustomError(err.message, 500));
            }
          };
   
 
        const resetSuperAdminPassword = async(req,res,next)=>{

                try {
                    await resetPassword(req,res,next,'super-admin')
                } catch (err) {
                    next(new CustomError(err.message,500));
                }  
          }

        const resetAdminPassword = async(req,res,next)=>{
            try {
               await resetPassword(req,res,next,'admin');
            } catch (err) {
                next(new CustomError(err.message,500));
            }
             
          }
   

        const adminGetSingleUser = async(req,res,next)=>{
              try {
                     const { userId } = req.params;
                     const user = await User.findById({_id:userId,role:'user'})
                                            .select("-password");
                                            
       
                     if (!user) {
                           return next(new CustomError('No user found',404));
                     }

                  // Check if the user is an admin
                     checkUserRole(user,'user');
       
                     res.status(200).json({ user });
              } catch (err) {
                     next(new CustomError(err.message, err.status));
              }
          }

        const adminGetAllUsers = async (req, res, next) => {
              try {
                  let  { limit , page} = req.pagination;
                  const {search} = req.query;
                  let query = {
                     role:'user'
                  }
                  if (search) {
                    query.$or = [
                      { username: { $regex: search, $options: 'i' }},  
                      { email: { $regex: search, $options: 'i' } },  
                      { role: { $regex: search, $options: 'i' } },  
                    ];
                  }

                  const users = await paginate(User, query, page, limit, {}, '', '-password');;
                  if(users.data.length === 0){
                       return next(new CustomError('No users found',404))
                  }
                  res.status(200).json({ users });

              } catch (err) {
                  next(new CustomError(err.message, 500));
              }
       
          };

        const adminCreateUser = async (req, res, next) => {
              try {
                     const { username, email, password } = req.body;

                     const newUser = new User({ username, email, password, role:'user' });

                     await newUser.save();

                     res.status(201).json({ message: 'User created successfully', user: newUser });
              } catch (err) {
                     next(new CustomError(err.message, 500));
              }
          };

        const adminUpdateUser = async (req, res, next) => {
              try {
                  const { userId } = req.params;
                  const { username , phoneNumber , email , password, isBlocked } = req.body;
                  console.log("user status is : ",isBlocked);
                  
                  const user = await User.findById(userId);
               
                  if (!user) {
                      return res.status(404).json({ error: 'User not found' });
                  }
 
                  checkUserRole(user,'user');
                  
                  user.username = username || user.username;
                  user.email = email || user.email;
                  user.phoneNumber = phoneNumber || user.phoneNumber;
                  user.isBlocked = isBlocked;         

                  if (password) {
                      const hashedPassword = await bcrypt.hash(password, 10);
                      user.password = hashedPassword;
                  }
          
                  await user.save();
          
                  res.status(200).json({ message: 'User updated successfully', updatedUser: user });

              } catch (err) {
                  next(new CustomError(err.message, err.status));
              }
          };

        const adminDeleteUser = async (req, res, next) => {
              try {
                  const { userId } = req.params;

                  // Retrieve the user by ID
                  const user = await User.findById(userId);
          
                  if (!user) {
                      return res.status(404).json({ error: 'User not exists' });
                  }

                    // Check if the user is an admin
                    checkUserRole(user,'user');
          
                  // Delete the user
                  await User.findByIdAndDelete(userId);
          
                  res.status(200).json({ message: 'User deleted successfully' });
              } catch (err) {
                  next(new CustomError(err.message, err.status));
              }
          };

        const adminBlockUnblockUser = async (req, res, next) => {
           
              try {
                  const { userId } = req.params;
                  const { block } = req.body;
          
               
                  const user = await User.findById(userId);
          
                  if (!user) {
                      return res.status(404).json({ error: 'User not found' });
                  }
   
                 // Check if the user is an admin
                 checkUserRole(user,'user');

                  if(user.isBlocked && block){
                         return next(new CustomError('User is already blocked',400));
                  }
                  if(!user.isBlocked && !block){
                         return next(new CustomError('User is already unblocked',400));
                  }
          
                  // Update the user's block status
                  user.isBlocked = block;
          
                  // Save the updated user
                  await user.save();
          
                  res.status(200).json({ message: `User ${block ? 'blocked' : 'unblocked'} successfully` });

              } catch (err) {
                  next(new CustomError(err.message, err.status));
              }
          };

        const getAdminProfile = async (req, res, next) => {
              try {
                
                  const adminId = req.user.id;
                  const admin = await User.findById(adminId);
          
                  if (!admin) {
                      return res.status(404).json({ error: 'Admin not found' });
                  }
          
                  // Check if the user is an admin
                  if (admin.role !== 'admin') {
                      return next(new CustomError('Access Denied: Only admins can access their own profile data', 403));
                  }
          
                  res.status(200).json({ admin });
              } catch (err) {
                  next(new CustomError(err.message, 500));
              }
          };

        const updateAdminProfile = async (req, res, next) => {
            try {
                const adminId = req.user.id;  
                const { username, email , phoneNumber , newPassword } = req.body;
         
                const admin = await User.findById(adminId);
        
                if (!admin) {
                    return res.status(404).json({ error: 'Admin not found' });
                }
        
                // Check if the user is an admin
                if (admin.role !== 'admin') {
                    return next(new CustomError('Access Denied: Only admins can update their own profile', 403));
                }
        
                // Update admin information
                admin.username = username || admin.username;
                admin.email = email || admin.email;
                admin.phoneNumber = phoneNumber|| admin.phoneNumber;
                admin.role = 'admin';
        
                // Update password if provided
                if (newPassword) {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    admin.password = hashedPassword;
                }
        
                // Save the updated admin
                await admin.save();
        
                res.status(200).json({ message: 'Admin profile updated successfully', updatedAdmin: admin });
            } catch (err) {
                next(new CustomError(err.message, 500));
            }
        };

        const updateSuperAdminProfileImage = async (req, res, next) => {
            try {
        
                const result = await  uploadImageToCloudinary(req.file);
        
                // Find the existing super admin user and update the image field
                const superAdmin = await User.findById(req.user.id);
                if (!superAdmin) {
                    return res.status(404).json({ error: 'Super Admin not found' });
                }
        
                superAdmin.image = result.secure_url;
                await superAdmin.save();
        
                res.status(200).json({ message: 'Profile image updated successfully' });
            } catch (err) {
                
                next(new CustomError(err.message, 500));
            }
        };

        const updateAdminProfileImage = async(req,res,next)=>{
            try{

                    const result = await uploadImageToCloudinary(req.file);
                    const admin = await User.findById(req.user.id);

                    if(!admin){
                        return next(new CustomError('Admin not found',404));
                    }  

                    admin.image = result.secure_url;
                    await admin.save();

                    res.status(200).json({ message: 'Profile image updated successfully' })

            }catch(err){
                    next(new CustomError(err.message,500));
            }

        }

        const getSuperAdminProfileImage = async (req, res, next) => {

            try {
                const superAdmin = await findUserAndCheckImage(req.user.id);
                res.status(200).json({ imageUrl: superAdmin.image });

            } catch (err) {
                next(new CustomError(err.message, 500));
            }
        };

        const getAdminProfileImage = async(req,res,next)=>{
            try {
                const admin = await findUserAndCheckImage(req.user.id);
                res.status(200).json({ imageUrl: admin.image });
            } catch (err) {
                next(new CustomError(err.message, 500));
            }
        }
        

        const getUserProfile = async(req,res,next)=>{
            try {
                
                const email = req.user.email;  
                const user = await User.findOne({email:email})
                                              .select("-password");
                if(!user){
                    return next(new CustomError('User not found',404));
                }
                res.status(200).json({profile:user});
            } catch (err) {
                    next(new CustomError(err.message,500));  
            }
        }

        const userProfileUpdate = async(req,res,next)=>{
                 try{
                         const email= req.user.email;
                         const{username,phoneNumber} = req.body;
                         const user = await User.findOne({email:email})
                                                 .select("-password");
                         if(!user){
                               return next(new CustomError('user not found',404));
                         }
                         user.username = username || user.username;
                         user.phoneNumber = phoneNumber || user.phoneNumber;
                         user.role = "user";

                         await user.save();
                         res.status(200).json({message:'Updated profile successfully',user:user})

                 }catch(err){
                       next(new CustomError(err.message,500));
                 }
        }
        
        const resetUserPassword = async(req,res,next)=>{

            try {
                await resetPassword(req,res,next,'user')
            } catch (err) {
                next(new CustomError(err.message,500));
            }  
        }
    
       const getUserProfileImage = async (req, res, next) => {

        try {
            const user = await findUserAndCheckImage(req.user.id);
            res.status(200).json({ imageUrl: user.image });

        } catch (err) {
            next(new CustomError(err.message, 500));
        }
        };

       const updateUserProfileImage = async (req, res, next) => {
        try {
    
            const result = await  uploadImageToCloudinary(req.file);
    
            // Find the existing super admin user and update the image field
            const user = await User.findOne({email:req.user.email});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            user.image = result.secure_url;
            await user.save();
    
            res.status(200).json({ message: 'Profile image updated successfully' });
        } catch (err) {
            
            next(new CustomError(err.message, 500));
        }
        };
         
 

 module.exports = {

    getAllEntities,
    getSingleEntity,
    updateSingleEntity,
    superAdminBlockUnblock,
    superAdminDelete,
    getSuperAdminProfile,
    updateSuperAdminProfile,
    resetSuperAdminPassword,
    adminGetSingleUser,
    adminGetAllUsers,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    adminBlockUnblockUser,
    getAdminProfile,
    updateAdminProfile,
    resetAdminPassword,
    updateSuperAdminProfileImage,
    updateAdminProfileImage,
    getSuperAdminProfileImage,
    getAdminProfileImage,
    getUserProfile,
    userProfileUpdate,
    resetUserPassword,
    getUserProfileImage,
    updateUserProfileImage

 }

