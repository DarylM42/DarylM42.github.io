#ifndef NODE_H
#define NODE_H

#include <iostream>
#include <string>
#include <vector>

class Course {
public:
    std::string courseNumber;
    std::string name;
    std::vector<std::string> prerequisites;

    Course();
    Course(const std::string& number, const std::string& title,
        const std::vector<std::string>& prereqs);

    void displayCourse() const;
};

class TreeNode {
public:
    Course course;
    TreeNode* left;
    TreeNode* right;
    int height;

    explicit TreeNode(const Course& c);
};

#endif