#include "Benchmark.h"

#include "AVLTree.h"
#include "BST.h"

#include <algorithm>
#include <chrono>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

namespace {

Course makeSyntheticCourse(int index) {
    ostringstream id;
    id << "C" << setw(6) << setfill('0') << index;
    return Course(id.str(), "Synthetic Course " + to_string(index), {});
}

vector<Course> buildSortedSyntheticCourses(size_t count) {
    vector<Course> synthetic;
    synthetic.reserve(count);

    for (size_t i = 0; i < count; ++i) {
        synthetic.push_back(makeSyntheticCourse(static_cast<int>(i)));
    }

    return synthetic;
}

bool verifyRotationCase(const string& label, const vector<string>& insertionOrder, const string& expectedRoot) {
    AVLTree avl;

    for (const string& id : insertionOrder) {
        avl.insertCourse(Course(id, "Rotation Test", {}));
        if (!avl.validateBalanceInvariant()) {
            cout << label << " failed: balance invariant broke after inserting " << id << "." << endl;
            return false;
        }
    }

    const string root = avl.getRootCourseNumber();
    if (root != expectedRoot) {
        cout << label << " failed: expected root " << expectedRoot
             << " but got " << root << "." << endl;
        return false;
    }

    return true;
}

long long timeBstInsertMicros(const vector<Course>& courses) {
    BST bst;
    const auto start = chrono::high_resolution_clock::now();
    for (const Course& c : courses) {
        bst.insertCourse(c);
    }
    const auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::microseconds>(end - start).count();
}

long long timeAvlInsertMicros(const vector<Course>& courses) {
    AVLTree avl;
    const auto start = chrono::high_resolution_clock::now();
    for (const Course& c : courses) {
        avl.insertCourse(c);
    }
    const auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::microseconds>(end - start).count();
}

long long timeBstSearchMicros(const vector<Course>& courses, const vector<string>& queries) {
    BST bst;
    for (const Course& c : courses) {
        bst.insertCourse(c);
    }

    const auto start = chrono::high_resolution_clock::now();
    for (const string& q : queries) {
        bst.searchCourse(q);
    }
    const auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::microseconds>(end - start).count();
}

long long timeAvlSearchMicros(const vector<Course>& courses, const vector<string>& queries) {
    AVLTree avl;
    for (const Course& c : courses) {
        avl.insertCourse(c);
    }

    const auto start = chrono::high_resolution_clock::now();
    for (const string& q : queries) {
        avl.searchCourse(q);
    }
    const auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::microseconds>(end - start).count();
}

double averageMicros(const vector<long long>& values) {
    if (values.empty()) {
        return 0.0;
    }

    long long total = 0;
    for (const long long value : values) {
        total += value;
    }

    return static_cast<double>(total) / static_cast<double>(values.size());
}

} // namespace

void runAVLRotationChecks() {
    cout << "\nAVL Rotation and Invariant Checks\n";

    const bool llPassed = verifyRotationCase("LL case", {"C300", "C200", "C100"}, "C200");
    const bool rrPassed = verifyRotationCase("RR case", {"C100", "C200", "C300"}, "C200");
    const bool lrPassed = verifyRotationCase("LR case", {"C300", "C100", "C200"}, "C200");
    const bool rlPassed = verifyRotationCase("RL case", {"C100", "C300", "C200"}, "C200");

    if (llPassed && rrPassed && lrPassed && rlPassed) {
        cout << "All rotation cases passed and AVL balance invariants held after each insertion." << endl;
    }
    else {
        cout << "One or more AVL checks failed. Review rotation and height update logic." << endl;
    }
}

void runBenchmark(const vector<Course>& courses) {
    if (courses.empty()) {
        cout << "Load course data first before running benchmarks." << endl;
        return;
    }

    constexpr size_t syntheticSize = 20000;
    constexpr int repetitions = 5;

    vector<Course> syntheticCourses = buildSortedSyntheticCourses(syntheticSize);
    vector<string> queries;
    for (size_t i = 0; i < syntheticCourses.size(); i += 50) {
        queries.push_back(syntheticCourses[i].courseNumber);
    }
    queries.push_back("C999999");

    vector<long long> bstInsertRuns;
    vector<long long> avlInsertRuns;
    vector<long long> bstSearchRuns;
    vector<long long> avlSearchRuns;
    bstInsertRuns.reserve(repetitions);
    avlInsertRuns.reserve(repetitions);
    bstSearchRuns.reserve(repetitions);
    avlSearchRuns.reserve(repetitions);

    for (int run = 0; run < repetitions; ++run) {
        bstInsertRuns.push_back(timeBstInsertMicros(syntheticCourses));
        avlInsertRuns.push_back(timeAvlInsertMicros(syntheticCourses));
        bstSearchRuns.push_back(timeBstSearchMicros(syntheticCourses, queries));
        avlSearchRuns.push_back(timeAvlSearchMicros(syntheticCourses, queries));
    }

    const double avgBstInsert = averageMicros(bstInsertRuns);
    const double avgAvlInsert = averageMicros(avlInsertRuns);
    const double avgBstSearch = averageMicros(bstSearchRuns);
    const double avgAvlSearch = averageMicros(avlSearchRuns);

    cout << "\nBenchmark Results (sorted synthetic input, " << syntheticSize
         << " records, " << repetitions << " runs)\n";
    cout << left << setw(28) << "Operation (avg microseconds)" << setw(16) << "BST" << "AVL" << endl;
    cout << left << setw(28) << "Insert all records" << setw(16) << static_cast<long long>(avgBstInsert)
         << static_cast<long long>(avgAvlInsert) << endl;
    cout << left << setw(28) << "Search sample + miss" << setw(16) << static_cast<long long>(avgBstSearch)
         << static_cast<long long>(avgAvlSearch) << endl;

    cout << "\nNote: the classroom CSV remains useful for functional verification,"
         << " but it is too small to reliably demonstrate asymptotic behavior in timings." << endl;
    cout << "This benchmark uses sorted synthetic input to stress BST worst-case growth and show AVL stability." << endl;
}