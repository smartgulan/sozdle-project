use axum::{
    extract::Query,
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use axum_server::Server;

#[tokio::main]
async fn main() {

    let app = Router::new().route("/", get(handler));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Сервер запущен на {}", addr);

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

async fn handler(Query(params): Query<WordQuery>) -> impl IntoResponse {

    if !is_valid_word(&params.word) {
        return (
            StatusCode::BAD_REQUEST,
            Json(Response {
                message: "Invalid word".to_string(),
            }),
        );
    }

    (
        StatusCode::OK,
        Json(Response {
            message: params.word,
        }),
    )
}


fn is_valid_word(word: &str) -> bool {

    word.len() == 5 && word.chars().all(|c| !c.is_digit(10))
}
