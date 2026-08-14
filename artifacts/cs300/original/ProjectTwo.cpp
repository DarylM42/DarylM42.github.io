// ProjectTwo.cpp - Advising Assistance Program
// Author: Daryl Murtha
// Course: CS 300 - Data Structures & Algorithms
// Date: June 18, 2025
// Description: This program reads course data from a file, stores it in a BST,
// and provides a menu system for advisors to search courses and view a sorted list.

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>

using namespace std;

// Class to represent a course
class Course {
public: 
	string courseNumber;
	string name;
	vector<string> prerequisites;

	// Constructor to initialize course details
	Course(string number, string title, vector<string> prereqs)
		: courseNumber(number), name(title), prerequisites(prereqs) {
	}

	// Display course details
	void displayCourse() const {
		cout << "Course Number: " << courseNumber << endl;
		cout << "Course Title: " << name << endl;
		cout << "Prerequisites: ";
		if (prerequisites.empty()) {
			cout << "None";
		}
		else {
			for (const string& prereq : prerequisites) {
				cout << prereq << " ";
			}
		}
		cout << endl;
	}
};

// Binary Search Tree (BST) structure for course storage
class TreeNode {
public:
	Course course;
	TreeNode* left;
	TreeNode* right;

	TreeNode(Course c) : course(c), left(nullptr), right(nullptr) {
	}
};

class BST {
private:
	TreeNode* root;

	// Recursive function to insert course into BST
	void insert(TreeNode*& node, Course course) {
		if (node == nullptr) {
			node = new TreeNode(course);
		}
		else if (course.courseNumber < node->course.courseNumber) {
			insert(node->left, course);
		}
		else {
			insert(node->right, course);
		}
	}

	// Recursive in-order traversal to display sorted courses
	void inOrderTraversal(TreeNode* node) const {
		if (node) {
			inOrderTraversal(node->left);
			node->course.displayCourse();
			inOrderTraversal(node->right);
		}
	}

	// Recursive search for a course
	Course* search(TreeNode* node, const string& courseNumber) const {
		if (node == nullptr) return nullptr;
		if (courseNumber == node->course.courseNumber) return &node->course;
		return (courseNumber < node->course.courseNumber) ?
			search(node->left, courseNumber) :
			search(node->right, courseNumber);
	}
public:
	// Constructor
	BST() : root(nullptr) {
	}

	// Insert course into BST
	void insertCourse(const Course& course) {
		insert(root, course);
	}

	// Display sorted list of courses
	void displayCourses() const {
		if (root == nullptr) {
			cout << "No courses available." << endl;
		}
		else {
			inOrderTraversal(root);
		}
	}

	// Search for a course by number
	Course* searchCourse(const string& courseNumber) const {
		return search(root, courseNumber);
	}
};

// Function to load course data from file into BST
void loadCoursesFromFile(BST& bst) {
	string fileName = "CS_300_ABCU_Advising_Program_Input.csv"; // Expected filename

	ifstream file(fileName);
	if (!file.is_open()) {
		cout << "Error: Cannot open file." << fileName << "'." << endl;
		cout << "Make sure the file is in the same directory as the executable." << endl;
		return;
	}

	string line;
	while (getline(file, line)) {
		stringstream ss(line);
		string courseNumber, courseTitle, prereq;
		vector<string> prerequisites;

		// Read course number and title
		getline(ss, courseNumber, ',');
		getline(ss, courseTitle, ',');

		// Read prerequisites if available
		while (getline(ss, prereq, ',')) {
			prerequisites.push_back(prereq);
		}

		// Create and insert course into BST
		Course course(courseNumber, courseTitle, prerequisites);
		bst.insertCourse(course);
	}

	file.close();
	cout << "Courses successfully loaded!" << endl;
}

// Function to display menu options
void displayMenu() {
	cout << "\nCourse Management System\n"
		<< "1 - Load Course Data\n"
		<< "2 - Display All Courses\n"
		<< "3 - Search for a Course\n"
		<< "9 - Exit\n"
		<< "Enter your choice: ";
}

int main() {
	BST courseTree;
	string fileName, courseNumber;
	int choice;

	while (true) {
		displayMenu();
		cin >> choice;
		switch (choice) {
			case 1:
				loadCoursesFromFile(courseTree);
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
			case 9:
				cout << "Exiting program..." << endl;
				return 0;
			default:
				cout << "Invalid selection. Try again." << endl;
		}
	}
}
