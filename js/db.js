$(function() {
  $(document).ready(function() {
    window.indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;

    window.IDBTransaction =
      window.IDBTransaction ||
      window.webkitIDBTransaction ||
      window.msIDBTransaction;
    window.IDBKeyRange =
      window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!window.indexedDB) {
      window.alert(
        "Your browser doesn't support a stable version of IndexedDB."
      );
    }
    var db;
    var request = window.indexedDB.open("money", 1);

    request.onerror = function(event) {};
    request.onsuccess = function(event) {
      db = request.result;
      var transaction = db.transaction(["transactions"]);
      var objectStore = transaction.objectStore("transactions");
      var lastTransaction = objectStore.get("last");
      lastTransaction.onsuccess = function(event) {
        if (lastTransaction.result) {
          var formData = lastTransaction.result;
          $("#amount")
            .val(formData.amount)
            .trigger("focus");
          $('#source option[value="' + formData.source + '"]').prop(
            "selected",
            true
          );
          $("#source")
            .formSelect("destroy")
            .formSelect()
            .change();
          $('#category option[value="' + formData.category + '"]').prop(
            "selected",
            true
          );
          $("#category")
            .formSelect("destroy")
            .formSelect()
            .change();
          $('#subCategory option[value="' + formData.subCategory + '"]').prop(
            "selected",
            true
          );
          $("#subCategory")
            .formSelect("destroy")
            .formSelect()
            .change();
          $("#comments")
            .val(formData.comments)
            .trigger("focus");
        }
      };
    };
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("transactions", { keyPath: "id" });
    };
    $("#transForm :input").change(function() {
      addTempFormData();
    });

    $(window).on("onunload", function() {
      addTempFormData();
    });

    function addTempFormData() {
      db.transaction(["transactions"], "readwrite")
        .objectStore("transactions")
        .delete("last");
      var request = db
        .transaction(["transactions"], "readwrite")
        .objectStore("transactions")
        .add({
          id: "last",
          amount: $("#amount").val(),
          source: $("#source").val(),
          category: $("#category").val(),
          subCategory: $("#subCategory").val(),
          comments: $("comments").val()
        });
    }
  });
});
