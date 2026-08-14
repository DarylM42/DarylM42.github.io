// ProjectTwo.cpp - Advising Assistance Program (Milestone Three Enhancements)
// Author: Daryl Murtha
// Course: CS 300 - Data Structures & Algorithms
// Date: July 2026
// Description: This program reads course data from a CSV file, stores it in an
// AVL tree for balanced performance, and provides a menu to display and search
// courses. It also includes optional BST vs AVL timing benchmarks.

#include "AVLTree.h"
#include "Benchmark.h"

#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

vector<Course> readCoursesFromFile(const string& fileName) {
    vector<Course> courses;

    ifstream file(fileName);
    if (!file.is_open()) {
        cout << "Error: Cannot open file '" << fileName << "'." << endl;
        cout << "Make sure the file is in the same directory as the executable." << endl;
        return courses;
    }

    string line;
    while (getline(file, line)) {
        if (line.empty()) {
            continue;
        }

        stringstream ss(line);
        string courseNumber;
        string courseTitle;
        string prereq;
        vector<string> prerequisites;

        getline(ss, courseNumber, ',');
        getline(ss, courseTitle, ',');

        if (courseNumber.empty() || courseTitle.empty()) {
            continue;
        }

        while (getline(ss, prereq, ',')) {
            if (!prereq.empty()) {
                prerequisites.push_back(prereq);
            }
        }

        courses.emplace_back(courseNumber, courseTitle, prerequisites);
    }

    return courses;
}

void loadCoursesIntoAVL(const vector<Course>& courses, AVLTree& avlTree) {
    for (const Course& course : courses) {
        avlTree.insertCourse(course);
    }
}

void displayMenu() {
    cout << "\nCourse Management System\n"
         << "1 - Load Course Data\n"
         << "2 - Display All Courses (AVL in-order)\n"
         << "3 - Search for a Course (AVL)\n"
         << "4 - Run BST vs AVL Benchmark (optional)\n"
         << "5 - Run AVL Rotation/Invariant Checks\n"
         << "9 - Exit\n"
         << "Enter your choice: ";
}

int main() {
    AVLTree courseTree;
    vector<Course> courses;
    const string fileName = "CS_300_ABCU_Advising_Program_Input.csv";
    string courseNumber;
    int choice = 0;

    while (true) {
        displayMenu();
        cin >> choice;

        switch (choice) {
        case 1:
            courses = readCoursesFromFile(fileName);
            if (courses.empty()) {
                cout << "No course data loaded." << endl;
                break;
            }
            courseTree.clearTree();
            loadCoursesIntoAVL(courses, courseTree);
            cout << "Courses successfully loaded into AVL tree!" << endl;
            break;

        case 2:
            cout << "\nCourse List:\n";
            courseTree.displayCourses();
            break;

        case 3:
            cout << "Enter Course Number: ";
            cin >> courseNumber;
            if (Course* found = courseTree.searchCourse(courseNumber)) {
                found->displayCourse();
            }
            else {
                cout << "Course not found." << endl;
            }
            break;

        case 4:
            runBenchmark(courses);
            break;

        case 5:
            runAVLRotationChecks();
            break;

        case 9:
            cout << "Exiting program..." << endl;
            return 0;

        default:
            cout << "Invalid selection. Try again." << endl;
            break;
        }
    }
}
