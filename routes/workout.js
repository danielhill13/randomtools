var express = require('express'),
    router  = express.Router(),
    Workout = require('../models/workout'),
    User = require('../models/user'),
    middleware = require('../middleware/index');

//WORKOUT ROUTES
//INDEX
router.get("/", function(req, res){
    // Workout.find({}, function(err, workouts){
Workout.find({}).sort({exercisedate: -1}).exec(function(err,workouts){
        if(err){
            console.log(err);
        } else {
            res.render("workouts/index", {workouts: workouts});
        }
    });
});

//NEW
router.get("/new", function(req, res){
    res.render("workouts/new");
});
// CREATE
router.post("/", function(req, res){
    var exercise = req.sanitize(req.body.workout.exercise);
    var weight = req.sanitize(req.body.workout.weight);
    var reps = req.sanitize(req.body.workout.reps);
    var sets = req.sanitize(req.body.workout.sets);
    var exercisedate = req.sanitize(req.body.workout.exercisedate);
    console.log(req.body);
    var newWorkout = {exercise: exercise, weight: weight, reps: reps, sets: sets, exercisedate: exercisedate}
    Workout.create(newWorkout, function(err, newWorkout){
        if(err){
            console.log(err);
        } else {
            console.log(newWorkout);
            res.redirect("/workouts");
        }
    })
})
//SHOW
// router.get("/:id", function(req, res){
//     Workout.findById(req.params.id).exec(function(err, foundWorkout){
//         if(err){
//             console.log(err);
//             res.redirect("/workouts");
//         }else {
//             res.render("workouts/show", {workout: foundWorkout});
//         }
//     })
// });
//SHOW BY DATE
router.post("/date", function(req, res){
    var datestart = req.body.datestart + "T00:00:00Z";
    var dateend = req.body.dateend + "T00:00:00Z";
    Workout.find({
        exercisedate: {
            $gte: new Date(datestart),
            $lt:  new Date(dateend) 
        }
    }).sort({exercisedate: -1}).exec(function(err, workouts){
        if(err){
            console.log(err);
        } else {
            res.render('workouts/showdate', {workouts: workouts, datestart: datestart, dateend: dateend}) ;
        }
    });
});
//SHOW BY TYPE
router.post("/type", function(req, res){
    var lifttype = req.body.lifttype;
    Workout.find({exercise: lifttype}).sort({exercisedate: -1}).exec(function(err, workouts){
        if(err){
            console.log(err);
        } else {
            res.render('workouts/showtype', {workouts: workouts, lifttype: lifttype}) ;
        }
    });
});
// EDIT - takes me to edit workout page
router.get("/:id/edit", function(req, res){
    Workout.findById(req.params.id, function(err, foundWorkout){
        res.render("workouts/edit", {workout: foundWorkout});
        });
    });
//UPDATE
router.put("/:id", function(req, res){
    Workout.findByIdAndUpdate(req.params.id, req.body.workout, function(err, updatedWorkout){
        if(err){
            console.log(err);
            res.redirect("/workouts");
        } else {
            res.redirect("/workouts/");
        }
    });
});
//DESTROY
router.delete("/:id", function(req, res){
    Workout.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Issue deleting workout");
            res.redirect("/workouts");
        } else{
            res.redirect("/workouts");
        }
    })
});

module.exports = router;