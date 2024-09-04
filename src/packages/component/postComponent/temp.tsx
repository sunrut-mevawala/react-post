import { Component, ReactNode } from "react";

interface ParentComponentProps {
    name: string;
}

class ParentComponent extends Component<ParentComponentProps> {
    render(){
        return (
                <h1>Hello World {this.props.name}</h1>
        )
    }
}

interface ChildComponentProps {
    name: string;
}

interface ChildComponentState {
    name: string;
}

class ChildClass extends Component<ChildComponentProps, ChildComponentState>{
    constructor(props:any){
        super(props);
        this.state = {name: props.name};
    }

    componentWillMount(): void {
        console.log('Will Mount Call');
    }

    componentDidMount(): void {
        console.log('Did mount call');
    }

    componentWillReceiveProps(nextProps: Readonly<ChildComponentProps>, nextContext: any): void {
        
    }

    componentWillUpdate(nextProps: Readonly<ChildComponentProps>, nextState: Readonly<ChildComponentState>, nextContext: any): void {
        
    }

    shouldComponentUpdate(nextProps: Readonly<ChildComponentProps>, nextState: Readonly<ChildComponentState>, nextContext: any): boolean {
        return false;   
    }

    componentWillUnmount(): void {
        console.log('Exit');
    }

    render() {
        return(
            <h1><ParentComponent name={this.state.name}/></h1>
        )
    }
}

export default ChildClass;