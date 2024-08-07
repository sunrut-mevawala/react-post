import * as React from "react";
import { Menu, MenuItem, Snackbar, IconButton as MuiIconButton, Alert, IconButtonProps } from "@mui/material";
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
import { getAllPost, insertPost, deletePost } from "../../../services/post.service";
import { getLoggedInUserId, getUserInfoFromLS } from "../../helpers/localStorage.hapler";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  const [postTitle, setPostTitle] = React.useState('');
  const [postDescription, setPostDescription] = React.useState('');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = React.useState<number | null>(null);

  const [titleError, setTitleError] = React.useState(false);
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [imageUrlError, setImageUrlError] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const userInfo = getUserInfoFromLS();

  React.useEffect(() => {
    getPostData();
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
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

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

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    
    if (!validateFields()) {
      return;
    }

    try {
      if(!selectedFile){
        setSnackbarMessage("No file has been selected!");
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      console.log(selectedFile);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userInfo?.id);
      formData.append('userName', userInfo?.userName);
      formData.append('postTitle', postTitle);
      formData.append('postDescription', postDescription);

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      const result = await insertPost(formData,config);
      if (result.data.status) {
        setSnackbarMessage("Post Inserted Successfully");
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
    handleClose();
  };

  const handleActionButtonClick = (event: any, postId: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

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

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        style={{ position: "absolute", top: "100px", right: "20px" }}
      >
        + Add Post
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Insert Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To insert a new record, please fill in the following fields and
            click submit.
          </DialogContentText>
          <form onSubmit={handleFormSubmit}>
            <TextField
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
              <Button type="submit" color="primary" onClick={handleFormSubmit}>
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: '5%' }}
      >
        {postData.map((item: any) => (
          <Card sx={{ maxWidth: 345, margin: "20px" }} key={item.id}>
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
              image="https://media.istockphoto.com/id/510244381/photo/typical-spanish-seafood-paella.jpg?s=612x612&w=0&k=20&c=XlXaHQfQTqxJZtfDLJ2J4QjrD3HJSxfJrQwew_jjikY="
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
        ))}
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
    </div>
  );
}
