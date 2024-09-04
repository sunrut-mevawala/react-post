import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton as MuiIconButton,
  MenuItem,
  InputAdornment,
  styled,
  Snackbar,
  Alert,
  CardActions,
  Collapse,
  CardContent,
  Typography,
  Card,
  CardMedia,
  Menu,
  CardHeader,
  Avatar,
  Skeleton,
  IconButtonProps,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostAddIcon from "@mui/icons-material/PostAdd";

import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import {
    deleteProduct,
  getAllCategories,
  getAllProducts,
  insertCategory,
  insertProduct,
  updateProduct,
} from "../../../services/product.service";
import { ExpandMore } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { getLoggedInUserId, getUserInfoFromLS } from "../../helpers/localStorage.hapler";
import { baseurl } from "../../../services/creds";
import Carousel from "react-material-ui-carousel";

const ProductComponent: React.FC = () => {
    const [expanded, setExpanded] = React.useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = React.useState(false);
    const [openProductDialog, setOpenProductDialog] = React.useState(false);
    const [productData, setProductData] = React.useState<any[]>([]);
    const [categoryList, setCategoryList] = React.useState<any[]>([]);

    const [selectedCategory, setSelectedCategory] = React.useState<any>();
    const [categoryTitle, setCategoryTitle] = React.useState("");
    const [categoryError, setCategoryError] = React.useState("");

    const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [productId, setProductId] = React.useState('');
    const [productTitle, setProductTitle] = React.useState("");
    const [productDescription, setProductDescription] = React.useState("");
    const [productCategory, setProductCategory] = React.useState<any>();
    const [price, setPrice] = React.useState("");
    const [discountPercentage, setDiscountPercentage] = React.useState("");
    const [discountedPrice, setDiscountedPrice] = React.useState("");
    const [fileError, setFileError] = React.useState("");
    const [loading, setLoading] = React.useState(true); // Add a loading state
    const [productTitleError, setProductTitleError] = React.useState("");
    const [descriptionError, setDescriptionError] = React.useState("");
    const [productcategoryError, setProductCategoryError] = React.useState("");
    const [priceError, setPriceError] = React.useState("");
    const [discountError, setDiscountError] = React.useState("");
    const [selectedFiles, setSelectedFiles] = React.useState<File[] | null>(null);
    const [productImages, setProductImages] = React.useState([]);
    const [dialogTitle, setDialogTitle] = React.useState('');
    const [dialogContentText, setDialogContentText] = React.useState('');
    const [buttonName, setButtonName] = React.useState('');
    const [prodcutimagePreviewUrl, setProductImagePreviewUrl] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
    const [categoryVariant, setCategoryVariant] = React.useState<'contained' | 'outlined'>('outlined');
    const [productVariant, setProductVariant] = React.useState<'contained' | 'outlined'>('outlined');



    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");
    const refTitle = React.useRef<HTMLInputElement>(null);;

    const userInfo = getUserInfoFromLS();

    interface ExpandMoreProps extends IconButtonProps {
        expand: boolean;
      }

    const ExpandMore = styled((props: ExpandMoreProps) => {
        const { expand, ...other } = props;
        return <MuiIconButton {...other} />;
      })(({ theme, expand }) => ({
        transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
          duration: theme.transitions.duration.shortest,
        }),
      }));


  const VisuallyHiddenInput = styled("input")({
    display: "none",
  });

  React.useEffect(() => {
      setTimeout(() => {
        getProductData();
      }, 3000); // Set timeout for 4 seconds (adjust to 5000 for 5 seconds if needed)
    }, []);

  const getProductData = async () => {
      try {
        const res = await getAllProducts("/getAllProducts", "");
        if (res.data.status) {
          setProductData(res.data.data);
        } else {
          console.log(res.data.message);
        }
      } catch (err) {
        console.error(err);
      }finally {
        setLoading(false); // Set loading state to false
      }
    };

  const handleCategoryDialogOpen = async () => {
    try {
      const categoriesList = await getAllCategories("/getAllCategories", "");
      if (categoriesList.data.status) {
        setCategoryList(categoriesList.data.data);
      }
    } catch (error: any) {
      console.error(error);
      //toaster message
    }

    setOpenCategoryDialog(true);
  };

const handleCloseActionMenu = () => {
    setAnchorEl(null);
}

  const handleCategoryDialogClose = () => {
    setOpenCategoryDialog(false);
  };

  const handleProductDialogOpen = async () => {

    setDialogTitle('Insert New Product');
    setProductTitle('');
    setProductDescription('');
    setProductCategory('');
    setPrice('');
    setDiscountPercentage('');
    setDiscountedPrice('');
    setButtonName('Insert')
    // setProductImagePreviewUrl(null);
    setOpen(true);
    setTimeout(() => {
      if(refTitle.current){
        const textfield = refTitle.current.querySelectorAll('input')[0];
        textfield.focus();
      }
    }, 10);
    fetchCategoryList();

    setOpenProductDialog(true);
  };

  const fetchCategoryList = async (id='') =>{
    try {
      const categoriesList = await getAllCategories("/getAllCategories", "");
      if (categoriesList.data.status) {
        setCategoryList(categoriesList.data.data);
        if(id){
          setProductCategory(id);
        }
      }
    } catch (error: any) {
      console.error(error);
      //toaster message
    }
  }

  const handleProductDialogClose = () => {
    setOpenProductDialog(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSaveCategory = async () => {
    let hasError = false;

    if (!categoryTitle) {
      setCategoryError("Category title is required");
      hasError = true;
    }

    if (!hasError) {
      console.log("Category Name:", selectedCategory);
      console.log("Category Title:", categoryTitle);

      try {
        const res = await insertCategory(
          { categoryName: categoryTitle, parentCategoryid: selectedCategory }," ");
        if (res.data.status) {
          setSnackbarMessage("Category inserted successfully!");
          setSnackbarSeverity("success");
          setOpenCategoryDialog(false);
        } else {
          setSnackbarMessage("Failed to insert category.");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      } catch (error: any) {
        setSnackbarMessage("Error inserting category.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSaveProduct = async (event:any,operationType:any) => {
    let hasError = false;

    if (!productTitle) {
      setProductTitleError("Please Enter the Product title");
      hasError = true;
    } else {
      setProductTitleError("");
    }

    if (!productDescription) {
      setDescriptionError("Please Enter the  Product description");
      hasError = true;
    } else {
      setDescriptionError("");
    }

    if (!productCategory) {
      setProductCategoryError("Please Enter the Product category");
      hasError = true;
    } else {
      setProductCategoryError("");
    }

    if (!price) {
      setPriceError("Please Enter the Price");
      hasError = true;
    } else {
      setPriceError("");
    }

    if (!discountPercentage) {
      setDiscountError("Please Enter the Discount percentage");
      hasError = true;
    } else {
      setDiscountError("");
    }

    if (!selectedFiles) {
      setFileError("Please Upload the Image file");
      hasError = true;
    } else {
      setFileError("");
    }

    if (!hasError) {
      console.log("Product Title:", productTitle);
      console.log("Product Description:", productDescription);
      console.log("Category:", productCategory);
      console.log("Price:", price);
      console.log("Discount Percentage:", discountPercentage);
      console.log("Discount Price:", discountedPrice);

      try {
        const formData = new FormData();
        if (selectedFiles) {
          for (let i = 0; i < selectedFiles?.length; i++) {
            formData.append("files", selectedFiles[i]);
          }
        }
        formData.append("productTitle", productTitle);
        formData.append("productDescription", productDescription);
        formData.append("categoryId", productCategory);
        formData.append("price", price);
        formData.append("discountPercentage", discountPercentage);
        formData.append("discountedPrice", discountedPrice);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        const res = operationType === 'Insert' ? await insertProduct(formData,config) : await updateProduct(`/updateProduct/${productId}`,formData,config);
        if (res.data.status) {
          setSnackbarMessage(`Product ${operationType === 'Insert' ? 'Inserted' : 'Updated'} successfully!`);
          setSnackbarSeverity("success");
          setOpenProductDialog(false);
        } else {
          setSnackbarMessage(res.data.message);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
        setSnackbarOpen(true);
      } catch (error: any) {
        setSnackbarMessage(error.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };


  const handleUpdate = async (productData:any) =>{
    console.log(productData);
    setDialogTitle("Update Product")
    setProductId(productData.id);
    setProductTitle(productData.productTitle);
    setProductDescription(productData.productDescription);
    fetchCategoryList(productData.CategoryId);
    console.log(productData.CategoryId,productCategory);
    setProductCategory(productData.CategoryId);
    setPrice(productData.price);
    setDiscountPercentage(productData.discountPercentage);
    setDiscountedPrice(productData.discountedPrice);
    setProductImages(productData.productImage);
    setButtonName('Update');
    setProductImagePreviewUrl(`${baseurl}/images/${productData.productImage}`); // Set image preview URL
    setOpenProductDialog(true);
  }


  React.useEffect(() => {
    if (price && discountPercentage) {
      const discount =
        (parseFloat(price) * parseFloat(discountPercentage)) / 100;
      setDiscountedPrice((parseFloat(price) - discount).toFixed(2));
    } else {
      setDiscountedPrice("");
    }
  }, [price, discountPercentage]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const uploadedFiles: any[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;
        if (
          fileType === "image/jpeg" ||
          fileType === "image/png" ||
          fileType === "image/jpg"
        ) {
          setFileError("");
          uploadedFiles.push(file); // Set the uploaded file
          console.log("File uploaded:", file.name);
        } else {
          setFileError("Only JPG, JPEG, and PNG files are allowed.");
          return;
        }
      }
      setSelectedFiles(uploadedFiles);
    }
    console.log(files);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  const handleDelete = async (e:any,id:string) => {
    if (!id) return;

    try {
      const result = await deleteProduct(`/deleteProduct/${id}`);
      if (result.data.status) {
        setSnackbarMessage("Product Deleted Successfully");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        getProductData();
      } else {
        setSnackbarMessage(result.data.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err: any) {
      setSnackbarMessage(err.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setAnchorEl(null);
  };


  const handleCategoryMouseEnter = () => {
    setCategoryVariant('contained');
  };

  const handleCategoryMouseLeave = () => {
    setCategoryVariant('outlined');
  };

  const handleProductMouseEnter = () => {
    setProductVariant('contained');
  };

  const handleProductMouseLeave = () => {
    setProductVariant('outlined');
  };


  return (
    <div>
      <div style={{ display: "flex", justifyContent: "end", top: "120px",marginRight:"1%" }}>
        <Button
          variant={categoryVariant}
          color="primary"
          onClick={handleCategoryDialogOpen}
          onMouseEnter={handleCategoryMouseEnter}
          onMouseLeave={handleCategoryMouseLeave}
          style={{ margin: "1%", padding: "0", backgroundColor: categoryVariant === 'contained' ? "#e47" : "transparent", color: categoryVariant === 'contained' ? "#ffffff" : "#e47", borderColor: "#e47"  }}
          title="Add Category"
        >
          <DashboardCustomizeOutlinedIcon />
        </Button>

        <Button
          variant={productVariant}
          color="primary"
          onMouseEnter={handleProductMouseEnter}
          onMouseLeave={handleProductMouseLeave}
          onClick={handleProductDialogOpen}
          style={{ margin: "1%",  backgroundColor: productVariant === 'contained' ? "#e47" : "transparent", color: productVariant === 'contained' ? "#ffffff" : "#e47", borderColor: "#e47"  }}
          title="Add Product"
        >
          <LibraryAddIcon />
        </Button>
      </div>

      {/* Dialog for Adding Product Category */}
      <Dialog open={openCategoryDialog} onClose={handleCategoryDialogClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Categories"
            type="text"
            fullWidth
            select
            variant="standard"
            onChange={(event: any) => {
              setSelectedCategory(event.target?.value?.id);
            }}
            value={selectedCategory?.categoryName}
          >
            {categoryList.map((item) => (
              <MenuItem key={item.id} value={item}>
                {item.categoryName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Category Title"
            type="text"
            fullWidth
            variant="standard"
            value={categoryTitle}
            onChange={(e) => {
              setCategoryTitle(e.target.value);
              if (e.target.value) {
                setCategoryError("");
              }
            }}
            error={!!categoryError}
            helperText={categoryError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoryDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding Product */}
      <Dialog open={openProductDialog} onClose={handleProductDialogClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product Title"
            type="text"
            fullWidth
            variant="standard"
            value={productTitle}
            onChange={(e) => {
              setProductTitle(e.target.value);
              if (e.target.value) {
                setProductTitleError("");
              }
            }}
            required={true}
            error={!!productTitleError}
            helperText={productTitleError}
          />
          <TextField
            margin="dense"
            label="Product Description"
            type="text"
            fullWidth
            variant="standard"
            value={productDescription}
            onChange={(e) => {
              setProductDescription(e.target.value);
              if (e.target.value) {
                setDescriptionError("");
              }
            }}
            required={true}
            error={!!descriptionError}
            helperText={descriptionError}
          />
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            variant="standard"
            value={productCategory}
            onChange={(e: any) => {
              setProductCategory(e.target?.value?.id);
              if (e.target.value) {
                setProductCategoryError("");
              }
            }}
            required={true}
            error={!!productcategoryError}
            helperText={productcategoryError}
          >
            {categoryList.map((item) => (
              <MenuItem key={item.id} value={item}>
                {item.categoryName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Price"
            type="text"
            fullWidth
            variant="standard"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (e.target.value) {
                setPriceError("");
              }
            }}
            required={true}
            error={!!priceError}
            helperText={priceError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Discount Percentage"
            type="text"
            fullWidth
            variant="standard"
            value={discountPercentage}
            onChange={(e) => {
              setDiscountPercentage(e.target.value);
              if (e.target.value) {
                setDiscountError("");
              }
            }}
            required={true}
            error={!!discountError}
            helperText={discountError}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <TextField
            margin="dense"
            label="Discount Price"
            type="text"
            fullWidth
            variant="standard"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
          <Button
            component="label"
            sx={{ marginTop: "3%" }}
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              multiple={true}
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileUpload}
            />
          </Button>
          {fileError && <p style={{ color: "red" }}>{fileError}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductDialogClose} color="primary">
            Cancel
          </Button>
          <Button  color="primary" onClick={(e:any) => handleSaveProduct(e,buttonName)}>
            {buttonName}
          </Button>
        </DialogActions>
      </Dialog>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "5%",
        }}
      >
        {loading
          ? Array.from(new Array(3)).map((_, index) => (
              <Card sx={{ maxWidth: 345, margin: "20px" }} key={index}>
                <CardHeader
                  avatar={
                    <Skeleton variant="circular" width={40} height={40} />
                  }
                  action={
                    <Skeleton variant="rectangular" width={300} height={24} />
                  }
                  title={<Skeleton width="80%" />}
                  subheader={<Skeleton width="40%" />}
                />
                <Skeleton variant="rectangular" height={194} />
                <CardContent>
                  <Skeleton width="90%" />
                  <Skeleton width="60%" />
                </CardContent>
                <CardActions disableSpacing>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                  {/* <Skeleton variant="rectangular" width="100%" height={30} /> */}
                </CardActions>
              </Card>
            ))
          : productData.map((item: any) => (
              <Card sx={{ minWidth: "20%", margin: "20px" }} key={item.id}>
                {/* <CardMedia
                  component="img"
                  height="194"
                  sx={{
                    objectFit: "cover", // Ensures the image covers the area without distortion
                    width: "100%", // Ensures the image width is consistent
                    //height: '100%', // Maintains the aspect ratio and ensures consistency
                  }}
                  image={`${baseurl}/images/${item.productImage[0]}`}
                  alt="Paella dish"
                /> */}
                <CardContent>
                <Carousel>
                    {
                        item.productImage.map( (img:any, i:number) => <img style={{height:"280px", width:"280px", objectFit:"contain"}} src={`${baseurl}/images/${img}`} /> )
                    }
                </Carousel>
                  <Typography variant="body2" color="text.secondary" sx={{color:"black"}}>
                    {item.productTitle}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <MuiIconButton aria-label="Update Product" onClick={() => handleUpdate(item)}>
                    <CreateTwoToneIcon />
                  </MuiIconButton>
                  <MuiIconButton aria-label="Delete Product" onClick={(e:any)=> handleDelete(e,item.id)}>
                    <DeleteIcon />
                  </MuiIconButton>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Description:</Typography>
                    <Typography>{item.productDescription}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductComponent;
