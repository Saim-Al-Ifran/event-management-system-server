const CustomError = require('../../errors/CustomError');
const Category = require('../../models/Category');
const { deleteImageFromCloudinary } = require('../../utils/deleteImageFromCloudinary');
const {uploadImageToCloudinary} = require('../../utils/imageUploadCloudinary');


const getCategories = async(_req,res,next)=>{
       try {
             const categories = await Category.find({});
             if(categories.length === 0){
                  return next(new CustomError('No categories found',404));
             }
             res.status(200).json({categories:categories});
       }catch(err){
            next(new CustomError(err.message,500));
       }
}

const createCategory = async(req,res,next)=>{
          
           try {
            
            const { name, description,slug } = req.body;

            const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });

            if (existingCategory) {
                return next(new CustomError('Category with the same name or slug already exists',400)); 
            }

            const cloudinaryResult = await uploadImageToCloudinary(req.file);

            const newCategory = new Category({ name, description, image: cloudinaryResult.secure_url });
            await newCategory.save();
    
            res.status(201).json({ message: 'Category created successfully', category: newCategory });
           }catch(err) {
              next(new CustomError(err.message,500));
           }

}

const updateCategory = async(req,res,next)=>{

    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;
        const image = req.file;

        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return next(new CustomError('Category not found',404));
        }
   
        let updatedImageUrl = existingCategory.image;
        if (image) {
            
            const cloudinaryResult = await uploadImageToCloudinary(image);
            updatedImageUrl = cloudinaryResult.secure_url;
        }

         
        existingCategory.name = name || existingCategory.name;
        existingCategory.description = description || existingCategory.description;
        existingCategory.image = updatedImageUrl;
  
        await existingCategory.save();

        res.status(200).json({ message: 'Category updated successfully', category: existingCategory });
        
    } catch (err) {
 
            next(new CustomError(err.message, 500));
 
    }
}
 
const deleteCategory = async (req, res, next) => {

    try {
        const { categoryId } = req.params;

        const existingCategory = await Category.findById(categoryId);

        if (!existingCategory) {
            return next(new CustomError('Category not found', 404));
        }

        if (existingCategory.image) {
           await deleteImageFromCloudinary(existingCategory.image);
        }

        await Category.deleteOne({_id:existingCategory._id});
      
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new CustomError('Invalid category ID', 400));
        }
        next(new CustomError(err.message, 500));
    }

};


module.exports ={
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}