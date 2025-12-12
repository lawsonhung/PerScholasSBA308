// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(course, ag, submissions) {

  try {

    const courseID = course.id;
    // Testing to error throwing if course ID does not match
    // const courseID = 132;

    // If an AssignmentGroup does not belong to its course (mismatching course_id), throw an error, letting the user know that the input was invalid.
    if (courseID != ag.course_id)
      throw new Error(`You don't belong to this course`);

    let dueAssignments = [];

    // Popluate dueAssignments array assuming the year is now 2025
    ag.assignments.forEach(assignment => {
      const yearDue = parseInt(assignment.due_at.slice(0, 4));

      if (typeof assignment.points_possible !== 'number') {
        if (parseInt(assignment.points_possible))
          assignment.points_possible = parseInt(assignment.points_possible);
        else
          throw new Error('Points possible has to be a number');
      }
      if (assignment.points_possible == 0)
        throw new Error('Points possible can not be 0');
      if (typeof assignment.id !== 'number') {
        if (parseInt(assignment.id))
          assignment.id = parseInt(assignment.id);
        else
          throw new Error('Assignment ID has to be a number');
      }

      if (yearDue < 2025) {
        dueAssignments.push(assignment);
      }
    });

    let dueSubmissions = [];

    // Populate dueSubmissions with submissions that are past due based on dueAssignments
    submissions.forEach(submission => {
      dueAssignments.forEach(assignment => {
        if (assignment.id == submission.assignment_id)
          dueSubmissions.push(submission);
      });
    });

    // Adjust for late submissions
    dueSubmissions.forEach(submission => {
      dueAssignments.forEach(assignment => {
        const dueDate = assignment.due_at.split('-');
        const submissionDate = submission.submission.submitted_at.split('-');

        if (submission.assignment_id == assignment.id) {
          // Assuming there are only 3 items in date.split array
          if (parseInt(submissionDate[0]) > parseInt(dueDate[0])) {
            submission.submission.score -= assignment.points_possible * .1;
            console.log('This submission was late', submission);
            return;
          }
          else if (parseInt(submissionDate[1]) > parseInt(dueDate[1])) {
            submission.submission.score -= assignment.points_possible * .1;
            console.log('This submission was late', submission);
            return;
          }
          else if (parseInt(submissionDate[2]) > parseInt(dueDate[2])) {
            submission.submission.score -= assignment.points_possible * .1;
            console.log('This submission was late', submission);
            return;
          }
        }
      });
    });

    let uniqueLearnerIDs = [];

    // Get unique learner IDs
    for (let submission of submissions) {
      if (!uniqueLearnerIDs.includes(submission.learner_id))
        uniqueLearnerIDs.push(submission.learner_id);
    }

    let result = [];

    // Populate result array with unique IDs
    uniqueLearnerIDs.forEach(id => {
      result.push({ id: id });
    });

    // For each due assignment, populate each learner result with the due assignment id
    // Filters out assignments that students turned in early and aren't due yet
    result.forEach(learnerResult => {
      learnerResult.avg = 0;
      dueAssignments.forEach(dueAssignment => {
        learnerResult[dueAssignment.id] = 0;
      })
    });

    // Populate result with averages for each course and total avg
    result.forEach(learnerResult => {

      // Populate result with scores and set average to sum for now
      dueSubmissions.forEach(submission => {
        if (submission.learner_id == learnerResult.id) {
          learnerResult[submission.assignment_id] = submission.submission.score;
          learnerResult.avg += submission.submission.score;
        }
      });

      // Weight scores and averages for each due assignment
      let totalPointsPossible = 0;
      dueAssignments.forEach(assignment => {
        learnerResult[assignment.id] /= assignment.points_possible;
        totalPointsPossible += assignment.points_possible;
      });
      learnerResult.avg /= totalPointsPossible;
    });

    return result;

    // // here, we would process this data to achieve the desired result.
    // const result = [
    //   {
    //     id: 125,
    //     avg: 0.985, // (47 + 150) / (50 + 150)
    //     1: 0.94, // 47 / 50
    //     2: 1.0 // 150 / 150
    //   },
    //   {
    //     id: 132,
    //     avg: 0.82, // (39 + 125) / (50 + 150)
    //     1: 0.78, // 39 / 50
    //     2: 0.833 // late: (140 - 15) / 150
    //   }
    // ];

    // return result;
  } catch (err) {
    console.error(err.message);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log('\nFINAL OUTPUT RESULT ==============================', result);
