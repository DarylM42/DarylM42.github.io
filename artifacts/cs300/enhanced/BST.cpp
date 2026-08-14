#include "BST.h"

#include <iostream>

BST::BST() : root(nullptr) {
}

BST::~BST() {
    clear(root);
}

TreeNode* BST::insert(TreeNode* node, const Course& course) {
    if (node == nullptr) {
        return new TreeNode(course);
    }

    if (course.courseNumber < node->course.courseNumber) {
        node->left = insert(node->left, course);
    }
    else if (course.courseNumber > node->course.courseNumber) {
        node->right = insert(node->right, course);
    }
    else {
        node->course = course;
    }

    return node;
}

void BST::inOrderTraversal(TreeNode* node) const {
    if (node == nullptr) {
        return;
    }

    inOrderTraversal(node->left);
    node->course.displayCourse();
    inOrderTraversal(node->right);
}

Course* BST::search(TreeNode* node, const std::string& courseNumber) const {
    if (node == nullptr) {
        return nullptr;
    }

    if (courseNumber == node->course.courseNumber) {
        return &node->course;
    }

    if (courseNumber < node->course.courseNumber) {
        return search(node->left, courseNumber);
    }

    return search(node->right, courseNumber);
}

void BST::clear(TreeNode* node) {
    if (node == nullptr) {
        return;
    }

    clear(node->left);
    clear(node->right);
    delete node;
}

void BST::insertCourse(const Course& course) {
    root = insert(root, course);
}

void BST::displayCourses() const {
    if (root == nullptr) {
        std::cout << "No courses available." << std::endl;
        return;
    }

    inOrderTraversal(root);
}

Course* BST::searchCourse(const std::string& courseNumber) const {
    return search(root, courseNumber);
}