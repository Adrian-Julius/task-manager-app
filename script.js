$(document).ready(function () {
  $(".board").click(function () {
    $(this).addClass("active");
    $(".list").removeClass("active");

    $(".tasksContainer").addClass("addedTasksContainer");
    $(".addedTasksContainer").removeClass("tasksContainer");

    $(".todoContainer").addClass("addedTodoContainer");
    $(".addedTodoContainer").removeClass("todoContainer");

    $(".doingContainer").addClass("addedDoingContainer");
    $(".addedDoingContainer").removeClass("doingContainer");

    $(".doneContainer").addClass("addedDoneContainer");
    $(".addedDoneContainer").removeClass("doneContainer");

    $(".todoTasks").addClass("addedTodoTasks");
    $(".addedTodoTasks").removeClass("todoTasks");

    $(".doingTasks").addClass("addedDoingTasks");
    $(".addedDoingTasks").removeClass("doingTasks");

    $(".tasksInfo").addClass("addedTasksInfo");
    $(".addedTasksInfo").removeClass("tasksInfo");

    $(".doneTasks").addClass("addedDoneTasks");
    $(".addedDoneTasks").removeClass("doneTasks");
  });

  $(".list").click(function () {
    $(this).addClass("active");
    $(".board").removeClass("active");

    $(".addedTasksContainer").addClass("tasksContainer");
    $(".tasksContainer").removeClass("addedTasksContainer");

    $(".addedTodoContainer").addClass("todoContainer");
    $(".todoContainer").removeClass("addedTodoContainer");

    $(".addedDoingContainer").addClass("doingContainer");
    $(".doingContainer").removeClass("addedDoingContainer");

    $(".addedDoneContainer").addClass("doneContainer");
    $(".doneContainer").removeClass("addedDoneContainer");

    $(".addedTodoTasks").addClass("todoTasks");
    $(".todoTasks").removeClass("addedTodoTasks");

    $(".addedDoingTasks").addClass("doingTasks");
    $(".doingTasks").removeClass("addedDoingTasks");

    $(".addedTasksInfo").addClass("tasksInfo");
    $(".tasksInfo").removeClass("addedTasksInfo");

    $(".addedDoneTasks").addClass("doneTasks");
    $(".doneTasks").removeClass("addedDoneTasks");
  });

  let formattedDate;

  // Show the "Add Task" form and hide description container
  $(".showAddTaskBtn").click(function () {
    $(".addTaskContainer").fadeIn(300);
    $("header").css({ filter: "blur(5px)" });
    $(".mainContainer").css({ filter: "blur(5px)" });
    $(".tasksDescContainer").fadeOut("fast");

    // generate min attribute of date
    const date = new Date();
    formattedDate = date.toISOString().split("T")[0];
    $("#duedate").attr("min", formattedDate);
  });

  // Close button for both "Add Task" and description containers
  $(".closeContainerBtn").click(function () {
    $(".addTaskContainer").fadeOut(300);
    $(".tasksDescContainer").fadeOut(300);
    $("header").css({ filter: "blur(0)" });
    $(".mainContainer").css({ filter: "blur(0)" });
  });

  let listId = 0;
  const tasksData = {}; // Dictionary to store task data

  // Add Task button functionality
  $(".addTaskBtn").click(function (event) {
    event.preventDefault();
    const taskName = $("#taskName").val();
    const taskDescription = $("#taskDescription").val();
    const duedate = $("#duedate").val();
    const taskStatus = $("#status").val();

    if (!taskName || !taskDescription || !duedate || !taskStatus) {
      $(".popupNotif").fadeIn();
      $(".popupNotif").text("Please fill in all required fields.");
      setTimeout(() => {
        $(".popupNotif").fadeOut();
      }, 2000);
      return;
    }

    if (duedate < formattedDate) {
      $(".popupNotif").fadeIn();
      $(".popupNotif").text(
        `Invalid Date! Value must be (${formattedDate} or later).`
      );
      setTimeout(() => {
        $(".popupNotif").fadeOut();
      }, 2300);
      return;
    }

    $(".popupNotif").fadeIn();
    $(".popupNotif").text("New task successfully added.");
    setTimeout(() => {
      $(".popupNotif").fadeOut();
    }, 2000);

    $(".addTaskContainer").fadeOut(300);
    $("header").css({ filter: "blur(0)" });
    $(".mainContainer").css({ filter: "blur(0)" });

    listId += 1;
    tasksData[listId] = {
      name: taskName,
      description: taskDescription,
      status: taskStatus,
      dueDate: duedate,
    };

    // tasks samples hide
    $(".sample").hide();

    const tasksInfoClass = $(".list").hasClass("active")
      ? "tasksInfo"
      : "addedTasksInfo";
    const taskItems = `<ul class="${tasksInfoClass}">
                        <li>${taskName}</li>
                        <li>Due on: ${tasksData[listId].dueDate}</li>
                        <li><button class="descriptionBtn" data-id="${listId}"><i class="fa-solid fa-chevron-right fa-lg"></i></button></li>
                       </ul>`;

    let taskContainer = "";
    switch (taskStatus) {
      case "todo":
        taskContainer = $(".list").hasClass("active")
          ? ".todoTasks"
          : ".addedTodoTasks";
        break;
      case "doing":
        taskContainer = $(".list").hasClass("active")
          ? ".doingTasks"
          : ".addedDoingTasks";
        break;
      case "done":
        taskContainer = $(".list").hasClass("active")
          ? ".doneTasks"
          : ".addedDoneTasks";
        break;
      default:
        console.log("No STATUS");
    }

    // Append the new task item
    const taskItem = document.createElement("li");
    taskItem.id = `${listId}`;
    taskItem.innerHTML = taskItems;
    $(taskContainer).append(taskItem);

    // reset the the values after successfully added
    $("#taskName").val("");
    $("#taskDescription").val("");
    $("#duedate").val("");
    $("#status").val("todo");
  });

  $(".descriptionBtnSample").click(function () {
    $(".tasksDescContainer").fadeIn(300);
    $("header").css({ filter: "blur(5px)" });
    $(".mainContainer").css({ filter: "blur(5px)" });
  });

  $(document).on("click", ".descriptionBtn", function () {
    $("header").css({ filter: "blur(5px)" });
    $(".mainContainer").css({ filter: "blur(5px)" });

    const taskId = $(this).data("id");
    const task = tasksData[taskId];

    $(".noTask").hide();
    $(".hasTask").show().html(`
      <h4>Task name:</h4>
      <p>${task.name}</p>

      <h4>Task Description:</h4>
      <p>${task.description}</p>

      <h4>Task Status:</h4>
      <p>${task.status}</p>

      <h4>Due Date:</h4>
      <p>${task.dueDate}</p>

      <button class="deleteTask" data-id="${taskId}" title="Remove Task">
        <i class="fa-solid fa-trash-can fa-xl"></i>
      </button>
    `);

    $(".tasksDescContainer").fadeIn(300);
  });

  // Delete Task function
  $(document).on("click", ".deleteTask", function () {
    const taskId = $(this).data("id");
    delete tasksData[taskId]; // Remove task from tasksData
    document.getElementById(taskId).remove();
    $(".tasksDescContainer").fadeOut(300);

    $("header").css({ filter: "blur(0)" });
    $(".mainContainer").css({ filter: "blur(0)" });
  });
});
