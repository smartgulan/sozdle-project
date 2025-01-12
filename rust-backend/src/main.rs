use axum::{
    extract::Query,
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use rand::seq::SliceRandom;
use serde::{Deserialize, Serialize};
use std::{
    fs::File,
    io::{self, BufRead},
    net::SocketAddr,
    path::Path,
    sync::{Arc, RwLock},
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use axum_server::Server;
use tokio::time;

#[tokio::main]
async fn main() {
   
    let words = load_words("data/words.txt").expect("Failed to load words.");
    let shared_words = Arc::new(words);
    let current_word = Arc::new(RwLock::new((String::new(), 0)));
    let words_clone = Arc::clone(&shared_words);
    let current_word_clone = Arc::clone(&current_word);
    tokio::spawn(async move {
        update_word_daily(words_clone, current_word_clone).await;
    });

    // Создаем маршруты
    let app = Router::new()
        .route(
            "/",
            get({
                let current_word = Arc::clone(&current_word);
                move |query| handler(query, current_word)
            }),
        )
        .route(
            "/current",
            get({
                let current_word = Arc::clone(&current_word);
                move || get_current_word(current_word)
            }),
        );

   
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("🚀 Server launched on {} 🚀", addr);

  
    Server::bind(addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}


#[derive(Deserialize)]
struct WordQuery {
    word: String,
}


#[derive(Serialize)]
struct Response {
    message: String,
}


async fn handler(
    Query(params): Query<WordQuery>,
    current_word: Arc<RwLock<(String, u64)>>,
) -> impl IntoResponse {
    let word_data = current_word.read().unwrap(); 
    let word = &word_data.0; 

    
    let input_word = params.word.to_lowercase();

  
    if !is_valid_word(&input_word) {
        return (
            StatusCode::BAD_REQUEST,
            Json(Response {
                message: "❗ Error: The word must be 5 characters long and not contain numbers.".to_string(),
            }),
        );
    }

    if input_word != *word {
        return (
            StatusCode::NOT_FOUND,
            Json(Response {
                message: "❗Error: word does not match current.".to_string(),
            }),
        );
    }

    (
        StatusCode::OK,
        Json(Response {
            message: "✅ Congratulations! The word has been guessed.".to_string(),
        }),
    )
}

async fn get_current_word(current_word: Arc<RwLock<(String, u64)>>) -> impl IntoResponse {
    let word_data = current_word.read().unwrap(); 
    let word = &word_data.0; 

    (
        StatusCode::OK,
        Json(Response {
            message: format!("Current word: {}", word),
        }),
    )
}


async fn update_word_daily(words: Arc<Vec<String>>, current_word: Arc<RwLock<(String, u64)>>) {
    loop {
        let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();
        let today = now.as_secs() / 86400; 

        {
            let mut word_data = current_word.write().unwrap();
            if word_data.1 != today {
              
                let new_word = words.choose(&mut rand::thread_rng()).unwrap().clone();
                *word_data = (new_word, today);
                println!("New word: {}", word_data.0);
            }
        }

        time::sleep(Duration::from_secs(60)).await;
    }
}

fn load_words<P: AsRef<Path>>(path: P) -> io::Result<Vec<String>> {
    let file = File::open(path)?;
    let reader = io::BufReader::new(file);
    reader
        .lines()
        .map(|line| line.map(|word| word.trim().to_lowercase())) 
        .collect()
}


fn is_valid_word(word: &str) -> bool {
    word.len() == 5 && word.chars().all(|c| !c.is_digit(10))
}
