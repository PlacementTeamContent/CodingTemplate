const fs = require("fs");
const { v4 } = require("uuid");

const parent_file_name = "Template";
const parent_file_path = "./parent_json/" + parent_file_name + ".json";
const output_file_path = "./output_json/" + parent_file_name + "_formatted.json";

const readFileAsync = async (file, options) =>
  await new Promise((resolve, reject) => {
    fs.readFile(file, options, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }
);

const getParentData = async () => {
    try {
      const parent_data = await readFileAsync(parent_file_path, "utf8");
      const parent_data_json = JSON.parse(parent_data);
      return parent_data_json;
    } catch (error) {
      console.error("Error reading questions:", error);
      throw error;
    }
}

const extractQuestionsData = (parent_data) => {

    let final_json_sheet = [];
    let input_output = [
      {
        "input": [],
        "average_time_spent": 0,
        "order_no": 100
      }
    ];
    let test_case_count = 0;
    let count_of_non_hidden_cases = 0;
    let questionData = {};
    let question_count = 0;
    let question_text = "";

    parent_data.forEach(data => {
        const problem_text = data["problem_text"];
        const short_text = data["short_text"];
        const input_format = data["input_format"];
        const output_format = data["output_format"];
        const difficulty = data["difficulty"] || "XXXX";
        const code_language = data["code_language"];
        const code_data = data["code_data"];
        const constraints = data["constraints"] || "";
        const company = data["company"] || "UNKNOWN";
        const explanation = data["explanation"] || "";
        const test_case_input = data["test_case_input"];
        const test_case_output = data["test_case_output"];
        const test_case_type = data["test_case_type"];
        

        if (problem_text) {
          if (question_count > 0) {      
            questionData["input_output"] = input_output;

            final_json_sheet.push(questionData);
          }
          question_text = problem_text + "<hr />";
          if (input_format) {
            question_text += "<b>Input</b><br />" + input_format + "<hr />"
          }
          if (output_format) {
            question_text += "<b>Output</b><br />" + output_format + "<hr />"
          }
          if (constraints) {
            question_text += "<b>Constraints</b><br />" + constraints + "<hr />"
          }
          if (explanation) {
            question_text += "<b>Explanation/b><br />" + explanation + "<hr />"
          }
          questionData = {};
          questionData["question_text"] = question_text;
          questionData["short_text"] = short_text;
          questionData["question_type"] = "CODING";
          questionData["question_key"] = question_count;
          questionData["skills"] = [];
          questionData["question_format"] = "CODING_PRACTICE";
          questionData["content_type"] = "MARKDOWN";
          questionData["difficulty"] = difficulty.toUpperCase();
          questionData["remarks"] = "";
          questionData["scores_updated"] = true;
          questionData["scores_computed"] = 10;
          questionData["questions_asked_by_companies_info"] = [];
          questionData["test_case_evaluation_metrics"] = [
            {
                "language": "C",
                "time_limit_to_execute_in_seconds": 2.01
            },
            {
                "language": "CPP",
                "time_limit_to_execute_in_seconds": 2.01
            },
            {
                "language": "PYTHON",
                "time_limit_to_execute_in_seconds": 10.01
            }
          ];
          questionData["solutions"] = [];
          questionData["hints"] = [];
          questionData["code_metadata"] = [
            {
                "is_editable": true,
                "language": "PYTHON39",
                "code_data": "",
                "default_code": true,
                "base64_encoded": false
            },
            {
                "is_editable": true,
                "language": "C",
                "code_data": "",
                "default_code": false,
                "base64_encoded": false
            },
            {
                "is_editable": true,
                "language": "CPP",
                "code_data": "",
                "default_code": false,
                "base64_encoded": false
            },
            {
                "is_editable": true,
                "language": "JAVA",
                "code_data": "",
                "default_code": false,
                "base64_encoded": false
            },
            {
                "is_editable": true,
                "language": "NODE_JS",
                "code_data": "",
                "default_code": false,
                "base64_encoded": false
            }
          ]
          questionData["cpp_python_time_factor"] = 0;
          questionData["question_id"] = v4();
          questionData["tag_names"] = ["POOL_1", "TOPIC_PYTHON_CODING_"+difficulty.toUpperCase()];

          questionData["code_metadata"].forEach(metadata => {
            if (code_language === "PYTHON" && metadata.language === "PYTHON39") {
              metadata["code_data"] = code_data
            }
            if (code_language === "JAVASCRIPT" && metadata.language === "NODE_JS") {
              metadata["code_data"] = code_data
            }
            if (metadata.language === code_language) {
              metadata["code_data"] = code_data
            }
          })
          
          question_count += 1;
          test_case_count = 0;
          count_of_non_hidden_cases = 0;
          input_output = [
            {
              "input": [],
              "average_time_spent": 0,
              "order_no": 100
            }
          ]
        }

        else {
          test_case_count += 1;
          let is_hidden = true;
          if (count_of_non_hidden_cases < 2) {
            is_hidden = false;
            count_of_non_hidden_cases += 1;
          }
          let input = {
            "input": test_case_input,
            "output": test_case_output,
            "is_hidden": is_hidden,
            "score": 1,
            "testcase_type": "DEFAULT",
            "t_id": test_case_count
          }
          input_output[0]["input"].push(input);
        }
    });


    console.log("\nWriting into file\n");
    const jsonData = JSON.stringify(final_json_sheet);
  fs.writeFile(output_file_path, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing the file:', err);
      return;
    }
    console.log('JSON file has been created successfully!');
  });
}

async function start() {
    try {
        const parent_data = await getParentData();
        extractQuestionsData(parent_data);
    } catch (error) {
      console.error("Error during processing:", error);
    }
}

start();
