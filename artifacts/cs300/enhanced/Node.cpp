#include "Node.h"

Course::Course() {
}

Course::Course(const std::string& number, const std::string& title,
    const std::vector<std::string>& prereqs)
    : courseNumber(number), name(title), prerequisites(prereqs) {
}

void Course::displayCourse() const {
    std::cout << "Course Number: " << courseNumber << std::endl;
    std::cout << "Course Title: " << name << std::endl;
    std::cout << "Prerequisites: ";

    if (prerequisites.empty()) {
        std::cout << "None";
    }
    else {
        for (const std::string& prereq : prerequisites) {
            std::cout << prereq << " ";
        }
    }

    std::cout << std::endl;
}

TreeNode::TreeNode(const Course& c)
    : course(c), left(nullptr), right(nullptr), height(1) {
}