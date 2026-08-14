#include "AVLTree.h"

#include <algorithm>
#include <cmath>
#include <iostream>

AVLTree::AVLTree() : root(nullptr) {
}

AVLTree::~AVLTree() {
    clear(root);
}

int AVLTree::height(TreeNode* node) const {
    if (node == nullptr) {
        return 0;
    }

    return node->height;
}

// Balance factor tells whether a node is left-heavy, balanced, or right-heavy.
int AVLTree::getBalance(TreeNode* node) const {
    if (node == nullptr) {
        return 0;
    }

    return height(node->left) - height(node->right);
}

// Right rotation fixes an LL imbalance and preserves in-order BST ordering.
TreeNode* AVLTree::rightRotate(TreeNode* y) {
    TreeNode* x = y->left;
    TreeNode* subtree = x->right;

    x->right = y;
    y->left = subtree;

    y->height = 1 + std::max(height(y->left), height(y->right));
    x->height = 1 + std::max(height(x->left), height(x->right));

    return x;
}

// Left rotation fixes an RR imbalance and preserves in-order BST ordering.
TreeNode* AVLTree::leftRotate(TreeNode* x) {
    TreeNode* y = x->right;
    TreeNode* subtree = y->left;

    y->left = x;
    x->right = subtree;

    x->height = 1 + std::max(height(x->left), height(x->right));
    y->height = 1 + std::max(height(y->left), height(y->right));

    return y;
}

TreeNode* AVLTree::insert(TreeNode* node, const Course& course) {
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
        return node;
    }

    // Height must be refreshed after inserting into a subtree.
    node->height = 1 + std::max(height(node->left), height(node->right));

    int balance = getBalance(node);

    // LL case
    if (balance > 1 && course.courseNumber < node->left->course.courseNumber) {
        return rightRotate(node);
    }

    // RR case
    if (balance < -1 && course.courseNumber > node->right->course.courseNumber) {
        return leftRotate(node);
    }

    // LR case
    if (balance > 1 && course.courseNumber > node->left->course.courseNumber) {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }

    // RL case
    if (balance < -1 && course.courseNumber < node->right->course.courseNumber) {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }

    return node;
}

void AVLTree::inOrderTraversal(TreeNode* node) const {
    if (node == nullptr) {
        return;
    }

    inOrderTraversal(node->left);
    node->course.displayCourse();
    inOrderTraversal(node->right);
}

Course* AVLTree::search(TreeNode* node, const std::string& courseNumber) const {
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

bool AVLTree::validateNode(TreeNode* node, int& computedHeight) const {
    if (node == nullptr) {
        computedHeight = 0;
        return true;
    }

    int leftHeight = 0;
    int rightHeight = 0;

    if (!validateNode(node->left, leftHeight) || !validateNode(node->right, rightHeight)) {
        return false;
    }

    if (std::abs(leftHeight - rightHeight) > 1) {
        return false;
    }

    int expectedHeight = 1 + std::max(leftHeight, rightHeight);
    if (node->height != expectedHeight) {
        return false;
    }

    if (node->left != nullptr && node->left->course.courseNumber >= node->course.courseNumber) {
        return false;
    }

    if (node->right != nullptr && node->right->course.courseNumber <= node->course.courseNumber) {
        return false;
    }

    computedHeight = expectedHeight;
    return true;
}

void AVLTree::clear(TreeNode* node) {
    if (node == nullptr) {
        return;
    }

    clear(node->left);
    clear(node->right);
    delete node;
}

void AVLTree::insertCourse(const Course& course) {
    root = insert(root, course);
}

void AVLTree::displayCourses() const {
    if (root == nullptr) {
        std::cout << "No courses available." << std::endl;
        return;
    }

    inOrderTraversal(root);
}

Course* AVLTree::searchCourse(const std::string& courseNumber) const {
    return search(root, courseNumber);
}

bool AVLTree::validateBalanceInvariant() const {
    int computedHeight = 0;
    return validateNode(root, computedHeight);
}

std::string AVLTree::getRootCourseNumber() const {
    if (root == nullptr) {
        return "";
    }

    return root->course.courseNumber;
}

void AVLTree::clearTree() {
    clear(root);
    root = nullptr;
}