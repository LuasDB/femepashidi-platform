import { Spinner } from 'reactstrap';


const CenteredSpinner = () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner
          color="primary"
          style={{
            height: '10rem',
            width: '10rem'
          }}
        >
          Loading...
        </Spinner>
      </div>
    );
  };
  
  export default CenteredSpinner;