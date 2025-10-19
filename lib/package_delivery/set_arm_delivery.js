var set_arm_delivery = function (rover) {

    if (rover.delivery_device === 'arm_delivery') {
        //lower dump trailer
        rover.servo_dump_tailer(rover, 1000);
    }

    //locck dump tailer bed
    setTimeout(() => {
        if (rover.delivery_device === 'arm_delivery') {
            rover.servo_bed(rover, 2000);
        }
    }, 5000);

    //raise arm delivery
    setTimeout(() => {


        let currentPWM1 = 800;
        let currentPWM2 = 1900;
        let speed = 1;
        let rate = 10;
    


            const interval = setInterval(() => {
                if (currentPWM1 > 1350) {
                    clearInterval(interval); // Stop when below 800
                    return;
                }
                if (rover.delivery_device === 'arm_delivery') {
                    rover.servo_arm_passenger_side(rover, currentPWM1);
                }
                else{
                    clearInterval(interval); // Stop if delivery device changed
                    return;
                }
                // Decrement
                currentPWM1 += speed;

            }, rate);


            const interval2 = setInterval(() => {
                if (currentPWM2 < 1350) {
                    clearInterval(interval2); // Stop when below 800
                    return;
                }
                if (rover.delivery_device === 'arm_delivery') {
                    rover.servo_arm_driver_side(rover, currentPWM2);
                }
                else{
                    clearInterval(interval2); // Stop if delivery device changed
                    return;
                }
                // Decrement
                currentPWM2 -= speed;

            }, rate);

      

     }, 6000)

};
module.exports = set_arm_delivery;