#ifndef BST_H
#define BST_H

#include "Node.h"

class BST {
private:
    TreeNode* root;

    TreeNode* insert(TreeNode* node, const Course& course);
    void inOrderTraversal(TreeNode* node) const;
    Course* search(TreeNode* node, const std::string& courseNumber) const;
    void clear(TreeNode* node);

public:
    BST();
    ~BST();

    void insertCourse(const Course& course);
    void displayCourses() const;
    Course* searchCourse(const std::string& courseNumber) const;
};

#endif