$(document).ready(function () {
    let newEvent = document.querySelector("#new-event");
    let overlayInNewEvent = document.querySelector("#overlay-in-new-event");


    // Function to close the modal
    function closeModal() {
        $(newEvent).css("display", "none");
        $(overlayInNewEvent).css("display", "none");
    }


    // Close the modal when clicking outside the modal content or overlay
    $(overlayInNewEvent).click(function () {
        closeModal();
    });
    
    $(newEvent).click(function (event) {
        // Prevent clicks within the modal from closing it
        event.stopPropagation();
    });
    $(document).keydown(function (event) {
        if(event.key === "Escape") {
            closeModal()
        }
    })
    
    function compareTimes(){
        let startTime = $("#event-start-time").val();
        let endTime = $("#event-end-time").val();   
        
        let startTimeHour = parseInt(startTime.substring(0,2));
        let startTimeMin = parseInt(startTime.substring(3,5));
        let endTimeHour = parseInt(endTime.substring(0,2));
        let endTimeMin = parseInt(endTime.substring(3,5));
        
        if(endTimeHour > startTimeHour)return true;
        else if(endTimeHour == startTimeHour && endTimeMin >= startTimeMin)return true;
        else return false;
    
    }
    $.noConflict();
    $.validator.addMethod("checkDates", function(value, element, params) {
        return  compareTimes() ;

    }, "End time must be after start");

// Handle form submission using AJAX (as shown in previous code)
    $("#new-event-form").validate({
        rules:{
            eventEndTime:{checkDates : true}
            
        },
        messages: {
            
        },
        submitHandler: function(form){
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                date: new Date(),
                dataType : 'json'
            })
                .done(function (response) {
                    if (response.success === 1) {    //success
                        window.location.href='/my-calendar'
                    } else {
                        // window.location.href='/classes'
                        alert('Something went wrong');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    });
})

