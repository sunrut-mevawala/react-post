import * as React from "react";
import { Menu, MenuItem, Snackbar, IconButton as MuiIconButton, Alert, IconButtonProps, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getAllPost, insertPost, deletePost, updatePost } from "../../../services/post.service";
import { getLoggedInUserId, getUserInfoFromLS } from "../../helpers/localStorage.hapler";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { baseurl } from "../../../services/creds";
import ChildClass from "./temp";


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

export default function RecipeReviewCards() {
  const [expanded, setExpanded] = React.useState(false);
  const [postData, setPostData] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [postId, setPostId] = React.useState('');
  const [postTitle, setPostTitle] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [postDescription, setPostDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = React.useState<number | null>(null);
  const [dialogContentText, setDialogContentText] = React.useState('');
  const [loading, setLoading] = React.useState(true); // Add a loading state
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [buttonName, setButtonName] = React.useState('');
  const [titleError, setTitleError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [imageUrlError, setImageUrlError] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null);
  const refTitle = React.useRef<HTMLInputElement>(null);;
  const [variant, setVariant] = React.useState<'contained' | 'outlined'>('outlined');

  const userInfo = getUserInfoFromLS();

  React.useEffect(() => {
    setTimeout(() => {
      getPostData();
    }, 3000); // Set timeout for 4 seconds (adjust to 5000 for 5 seconds if needed)
  }, []);

  const getPostData = async () => {
    try {
      const res = await getAllPost("/getAllPosts", "");
      if (res.data.status) {
        setPostData(res.data.data);
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }finally {
      setLoading(false); // Set loading state to false
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = () => {
    setDialogTitle('Insert Record');
    setDialogContentText('To insert a new record, please fill in the following fields and click submit.')
    setPostTitle('');
    setPostDescription('');
    setButtonName('Insert')
    setImagePreviewUrl(null);
    setOpen(true);
    setTimeout(() => {
      if(refTitle.current){
        const textfield = refTitle.current.querySelectorAll('input')[0];
        textfield.focus();
      }
    }, 10); 
  };

  const nullData = () => {
    setPostTitle('');
    setPostDescription('');
    setImageUrl('');
    setUserId('')
    setUserName('');
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const validateFields = () => {
    let valid = true;
    setTitleError(false);
    setDescriptionError(false);
    setImageUrlError(false);

    if (postTitle.trim() === '') {
      setTitleError(true);
      valid = false;
    }
    if (postDescription.trim() === '') {
      setDescriptionError(true);
      valid = false;
    }


    return valid;
  };
  
  const handleForFileUpload = (e:any) =>{
    const file = e.target.files[0];
    console.log(file);
    setSelectedFile(file);

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFileTypes.includes(file.any)) {
      setSnackbarMessage("Invalid file type! Only jpg, jpeg, and png are allowed.");
      setSnackbarSeverity('error');
      return;
    }
  }

  const handleFormSubmit = async (event: any, operationType:string) => {
    event.preventDefault();
    
    if (!validateFields()) {
      return;
    }

    try {
      if(operationType === 'Insert' && !selectedFile){
        setSnackbarMessage("No file has been selected!");
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      
      const formData = new FormData();
      selectedFile && formData.append('file', selectedFile);
      // operationType === 'Update' && formData.append('id',postId);
      formData.append('userId', userInfo?.id);
      formData.append('userName', userInfo?.userName);
      formData.append('postTitle', postTitle);
      formData.append('postDescription', postDescription);
      !selectedFile && operationType === 'Update' && formData.append('imageUrl', imageUrl);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      const result = operationType === 'Insert' ? await insertPost(formData,config) : await updatePost(`/updatepost/${postId}`,formData,config);
      if (result.data.status) {
        setSnackbarMessage(`Post ${operationType === 'Insert' ? 'Inserted' : 'Updated'} Successfully`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        getPostData();
        nullData();
        setSelectedFile(null);
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
    handleClose();
  };

  const handleActionButtonClick = (event: any, postId: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleUpdate = async (postData:any) =>{
    console.log(postData);
    setDialogTitle('Update Record');
    setDialogContentText('To Update your record, please Update your fields and click Update.')
    setPostId(postData.id);
    setPostTitle(postData.postTitle);
    setPostDescription(postData.postDescription);
    setImageUrl(postData.imageUrl);
    setImagePreviewUrl(`${baseurl}/images/${postData.imageUrl}`); // Set image preview URL
    setButtonName('Update');
    setOpen(true);
  }

  const handleDelete = async () => {
    if (selectedPostId === null) return;

    try {
      const result = await deletePost(`/deletePost/${selectedPostId}`);
      if (result.data.status) {
        setSnackbarMessage("Post Deleted Successfully");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        getPostData();
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

  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleMouseLeave = () => {
    setVariant('outlined');
  };

  const handleMouseEnter = () => {
    setVariant('contained');
  };

  return (
    <div>
      <Button
        variant={variant}
        onClick={handleClickOpen}     
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: "absolute", top: "120px", right: "20px", backgroundColor: variant === 'contained' ? "#e47" : "transparent", color: variant === 'contained' ? "#ffffff" : "#e47", borderColor: "#e47" }}
      >
        + Add Post
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContentText}
          </DialogContentText>

          
            <TextField
              ref={refTitle}
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              margin="dense"
              id="postTitle"
              label="Post Title"
              type="text"
              fullWidth
              required
              error={titleError}
              helperText={titleError ? "Post title is required" : ""}
            />
            <TextField
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              margin="dense"
              id="postDescription"
              label="Post Description"
              type="text"
              fullWidth
              required
              error={descriptionError}
              helperText={descriptionError ? "Post description is required" : ""}
            />
            {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="Image Preview"
          style={{ width: '100%', marginBottom: '10px' }} // Adjust style as needed
        />
      )}
            <Button
              component="label"
              sx={{marginTop :"3%"}}
              role={undefined}
              variant="contained"
              tabIndex={-1}
              onChange={handleForFileUpload}
              startIcon={<CloudUploadIcon />}
               >Upload file
              <VisuallyHiddenInput type="file" />
            </Button>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" onClick={(e:any) => handleFormSubmit(e,buttonName)}>
                {buttonName}
              </Button>
            </DialogActions>
        </DialogContent>
      </Dialog>

      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: '5%' }}
      >
        {loading ? (
          Array.from(new Array(3)).map((_, index) => (
            <Card sx={{ maxWidth: 345, margin: "20px" }} key={index}>
              <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                action={<Skeleton variant="rectangular" width={300} height={24} />}
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
        ) : (
        postData.map((item: any) => (
          
          <Card sx={{ minWidth:"20%", margin: "20px" }} key={item.id}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  R
                </Avatar>
              }
              action={ userInfo?.userType === 'admin' || getLoggedInUserId() == item.userId ?
                <>
                  <MuiIconButton
                    onClick={(e) => handleActionButtonClick(e, item.id)}
                    aria-label="settings"
                  >
                    <MoreVertIcon />
                  </MuiIconButton>

                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedPostId === item.id}
                    onClose={handleCloseActionMenu}
                    PaperProps={{
                      style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                      },
                    }}
                  >
                    <MenuItem key={'update'} onClick={()=>handleUpdate(item)}>
                      Update
                    </MenuItem>
                    <MenuItem key={'delete'} onClick={handleDelete}>
                      Delete
                    </MenuItem>
                  </Menu>
                </>
                :<></>
              }
              title={item.userName}
              subheader="September 14, 2016"
            />
            <CardMedia
              component="img"
              height="194"
              sx={{
                objectFit: 'cover', // Ensures the image covers the area without distortion
                width: '100%', // Ensures the image width is consistent
                //height: '100%', // Maintains the aspect ratio and ensures consistency
              }}            
              image={`${baseurl}/images/${item.imageUrl}`}
              alt="Paella dish"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {item.postTitle}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <MuiIconButton aria-label="add to favorites">
                <FavoriteIcon />
              </MuiIconButton>
              <MuiIconButton aria-label="share">
                <ShareIcon />
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
                <Typography>{item.postDescription}</Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))
        )}
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ChildClass name={'Sunrut'}/>
    </div>
  );
}



