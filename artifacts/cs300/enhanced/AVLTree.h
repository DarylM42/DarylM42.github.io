#ifndef AVLTREE_H
#define AVLTREE_H

#include "Node.h"

class AVLTree {
private:
    TreeNode* root;

    int height(TreeNode* node) const;
    int getBalance(TreeNode* node) const;

    TreeNode* rightRotate(TreeNode* y);
    TreeNode* leftRotate(TreeNode* x);

    TreeNode* insert(TreeNode* node, const Course& course);
    void inOrderTraversal(TreeNode* node) const;
    Course* search(TreeNode* node, const std::string& courseNumber) const;
    bool validateNode(TreeNode* node, int& computedHeight) const;
    void clear(TreeNode* node);

public:
    AVLTree();
    ~AVLTree();

    void insertCourse(const Course& course);
    void displayCourses() const;
    Course* searchCourse(const std::string& courseNumber) const;
    bool validateBalanceInvariant() const;
    std::string getRootCourseNumber() const;
    void clearTree();
};

#endif