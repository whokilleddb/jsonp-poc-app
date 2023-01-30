function validate(){
    var name = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    if( name ==='' || password ===''){
        alert("Please Fill All Fields!");
        return false;
    }
    else{
        return true;
    }
}


function submit(){
    if (validate()) {
        var name = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        fetch('/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "username": name,
                                        "password": password })
            })
            .then(response => response.json())
            .then(data => {
                var j_resp = JSON.stringify(data)
                console.log(j_resp)
                if (data.success) {
                    // Redirect the user to the dashboard page
                    window.location.href = '/console';
                } else {
                    // Show an error message
                    alert('Invalid username or password');
                }
            });
        return true;
    }
    else {
        console.log("Failed to log credentials")
    }
}

