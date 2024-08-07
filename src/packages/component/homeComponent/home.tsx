import { getUserInfoFromLS } from "../../helpers/localStorage.hapler";

const HomeComponent = () => {
    const user = getUserInfoFromLS();
    
    return(
        <div>Welcome {user?.userName}</div>
    )
}

export default HomeComponent;