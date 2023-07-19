import { useState, useEffect } from "react";
import "./App.css";

const initialState = {
  ccNumber: ""
};

const initialErrorState = {
  ccNumber: {
    invalid: false,
    message: "",
  }
};

function App() {
  const [ccApplicationData, setCCApplicationData] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialErrorState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [httpError, setHttpError] = useState("");
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(null);


  useEffect(() => {
    const controller = new AbortController();
    if (isSubmitted && !hasErrors) {
      setIsLoading(true);
      fetch(`http://localhost:4100/api/validate`, {
        method: 'POST',
        body: JSON.stringify(ccApplicationData),
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller?.signal
      })
      .then(response => response.json())
      .then(res => {
        setIsValid(res);
        setIsSubmitted(false);
        setIsLoading(false);
      }).catch(e => {
        console.log(e);
        setIsLoading(false);
        setHttpError('Something went wrong. Please contact administrator.');
      });
    }
    return () => {
      controller.abort();
    };
  }, [isSubmitted, ccApplicationData, hasErrors]);

  const submitHandler = (e) => {
    e.preventDefault();
    setFormErrors(() => validateForm(ccApplicationData));
    setIsSubmitted(true);
  };

  const validateForm = (formData) => {   
    const errors = { ...initialErrorState };

    if (!formData.ccNumber || formData.ccNumber.trim() === "") {
      errors.ccNumber = { invalid: true, message: "Credit card number is required" };
    } else {
      errors.ccNumber = { invalid: false, message: "" };
    }
  
    let validationErrors = false;
    for (const key in errors) {
      if (errors[key].invalid === true) {
        validationErrors = true;
      }
    }
    if (validationErrors) {
      setHasErrors(true);
    } else {
      setHasErrors(false);
    }
    return errors;
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCCApplicationData((currState) => {
      return {
        ...currState,
        [name]: value,
      };
    });
  };

  const resetHandler = () => {
    setCCApplicationData(initialState);
    setHasErrors(false);
    setIsSubmitted(false);
    setIsValid(false);
    setHttpError("");
  }

  return (
    <>
      <h2>Credit card number validator</h2>
      {httpError && <p className="error">{httpError}</p>}
      {isLoading && <p className="loader"><span className="loading"></span></p>}
      <div>
        <form onSubmit={submitHandler}>
          <input type="text" name="ccNumber" id="ccNumber" placeholder="Credit card number" value={ccApplicationData.ccNumber} onChange={(e) => inputChangeHandler(e)} />
          <button type="submit">Validate</button>
          <button type="button" onClick={resetHandler}>Reset</button>
          {formErrors.ccNumber.invalid && (<p className="error">{formErrors.ccNumber.message}</p>)}
          {isValid && isValid.status && <p className={isValid.status === 'valid' ? 'success' : 'error'}>{isValid.message}</p>}
        </form>
      </div>
    </>
  );
}

export default App;
