from flask import Flask, render_template, request, redirect
import csv
import os

def write_to_csv(dict_data):
    csv_file_path = 'C:/Users/Yahya/Desktop/Quiz/database.csv'
    titles = ['firstname', 'lastname', 'phone', 'email', 'message']

    
    if os.path.isfile(csv_file_path):
        with open(csv_file_path, mode="a", newline='') as database:
            # File exists, don't write header
            database_writer = csv.DictWriter(database, fieldnames=titles)
            database_writer.writerow(dict_data)
    else:
        with open(csv_file_path, mode="a", newline='') as database:
            # File doesn't exist, write header
            database_writer = csv.DictWriter(database, fieldnames=titles)
            database_writer.writeheader()
            database_writer.writerow(dict_data)

app = Flask(__name__)


@app.route("/")
# Route 1
def index():
    return render_template('index.html')


@app.route("/<string:page_name>")
# Route 1
def page(page_name):
    return render_template(page_name)


@app.route("/submit_form", methods=["POST", "GET"])
def submit_form():
    try:
        if request.method == "POST":
            data = request.form.to_dict()
            write_to_csv(data)
            return redirect("/index.html")

        else:
            return "There was some error. Please Try again"
    except Exception as e:
        print(e)
        

if __name__ == "__main__":  # We can use this if we don't want to type the command
    # flask --app server.py run --debug
    app.run(debug=True)
